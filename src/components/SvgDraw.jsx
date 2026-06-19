import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SvgDraw = () => {
    const wrapperRef = useRef(null);
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const carouselWrapperRef = useRef(null);

    // Active slide index and visibility states
    const [activeSlide, setActiveSlide] = useState(0);
    const [carouselVisible, setCarouselVisible] = useState(false);

    // Ref to store current frame index for resize redraws
    const currentFrameRef = useRef(0);

    // List of high-res showcase images for the carousel
    const carouselImages = [
        { src: "/assets/project_ice_chalet.png", title: "ICE CHALET", tagline: "Breaking the ice" },
        { src: "/assets/project_toblerone.png", title: "TOBLERONE", tagline: "Vibrant geometry" },
        { src: "/assets/project_tecate.png", title: "TECATE", tagline: "Forged in Mexican spirit" },
        { src: "/assets/project_penfolds.png", title: "PENFOLDS", tagline: "Luxury bottle branding" },
        { src: "/assets/intro_thumb.png", title: "TATE & LYLE", tagline: "The Wonder of Science" }
    ];

    // Auto-advance full-screen slideshow once revealed
    useEffect(() => {
        if (!carouselVisible) {
            setActiveSlide(0);
            return;
        }

        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % carouselImages.length);
        }, 3500); // Transition slide every 3.5 seconds

        return () => clearInterval(interval);
    }, [carouselVisible]);

    // Staggered text animations on slide changes
    useEffect(() => {
        if (!carouselVisible || !carouselWrapperRef.current) return;

        const slides = carouselWrapperRef.current.querySelectorAll('.carousel-slide');
        const currentSlideEl = slides[activeSlide];
        if (!currentSlideEl) return;

        const eyebrow = currentSlideEl.querySelector('.slide-eyebrow');
        const title = currentSlideEl.querySelector('.slide-title');
        const tagline = currentSlideEl.querySelector('.slide-tagline');

        // Reset positions only for the incoming slide's text to prevent layout jumps on other slides
        gsap.set([eyebrow, title, tagline], { y: 24, opacity: 0 });

        // Staggered reveal
        gsap.to([eyebrow, title, tagline], {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    }, [activeSlide, carouselVisible]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');

        // Preload frame assets from the B frames folder (240 frames total, 1280x720 resolution)
        const frameCount = 240;
        const images = [];
        let loadedCount = 0;

        const padZero = (num) => String(num).padStart(4, '0');

        // Draw image with full-viewport 'cover' scaling (prevents letterboxing or stretching)
        const drawFrameImg = (img) => {
            if (!img || !img.complete) return;
            context.clearRect(0, 0, canvas.width, canvas.height);

            const imgRatio = img.width / img.height;
            const canvasRatio = canvas.width / canvas.height;
            let drawWidth, drawHeight, drawX, drawY;

            if (imgRatio > canvasRatio) {
                // Image is wider than canvas aspect ratio
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                drawX = (canvas.width - drawWidth) / 2;
                drawY = 0;
            } else {
                // Canvas is wider than image aspect ratio
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                drawX = 0;
                drawY = (canvas.height - drawHeight) / 2;
            }

            context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        };

        const drawFrame = (index) => {
            const img = images[index];
            if (img) drawFrameImg(img);
        };

        // Resize handler to make canvas resolution responsive to viewport sizes
        const handleResize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawFrame(currentFrameRef.current);
        };

        // Draw initial static placeholder frame while caching images
        const initialImg = new Image();
        initialImg.src = `/B frames/frame_0001.png`;
        initialImg.onload = () => {
            if (images.length === 0 || !images[0]) {
                drawFrameImg(initialImg);
            }
        };

        // Cache all 240 frame assets in browser memory
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `/B frames/frame_${padZero(i)}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    // Force initial render once load is complete
                    drawFrameImg(images[0]);
                }
            };
            images.push(img);
        }

        window.addEventListener('resize', handleResize);
        // Set initial canvas size
        handleResize();

        // Initialize GSAP scroll reveal timelines
        const ctx = gsap.context(() => {
            // 1. Entry timeline - runs from when SvgDraw enters bottom until it reaches top of screen
            // Fades background color and scrubs first B frames immediately on scroll entry
            const entryTl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top bottom',
                    end: 'top top',
                    scrub: 0.5,
                    invalidateOnRefresh: true
                }
            });

            // Fade background from Intro's off-white (#eae7e2) to dark (#08060d)
            entryTl.fromTo(sectionRef.current,
                { backgroundColor: '#eae7e2' },
                { backgroundColor: '#08060d', ease: 'none', duration: 1.0 },
                0
            );

            // Scrub B frames from 0 to 90 during scroll-in
            const entryFrameObj = { frame: 0 };
            entryTl.to(entryFrameObj, {
                frame: 90,
                snap: 'frame',
                ease: 'none',
                duration: 1.0,
                onUpdate: () => {
                    const currentIdx = Math.floor(entryFrameObj.frame);
                    currentFrameRef.current = currentIdx; // Cache current index for resize hooks
                    drawFrame(currentIdx);
                }
            }, 0);

            // 2. Pinning timeline - pins SvgDraw at top top for 3 viewports total
            // Scrubs remaining B frames slowly while pinned, then plays zoom out portal and reveals carousel
            const pinTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300%',
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        // Activate carousel autoplay once B animation finishes and zoom reveal begins (at progress 0.43)
                        if (self.progress >= 0.43) {
                            setCarouselVisible(true);
                        } else {
                            setCarouselVisible(false);
                        }
                    }
                }
            });

            // Continue B frame scrub from 90 to 239 during the first half of pinning (duration 1.5)
            const pinFrameObj = { frame: 90 };
            pinTl.to(pinFrameObj, {
                frame: frameCount - 1,
                snap: 'frame',
                ease: 'none',
                duration: 1.5,
                onUpdate: () => {
                    const currentIdx = Math.floor(pinFrameObj.frame);
                    currentFrameRef.current = currentIdx; // Cache current index for resize hooks
                    drawFrame(currentIdx);
                }
            }, 0);

            // Canvas Zoom Out Portal (scale 1 -> 15, fade out)
            // Starts at timeline progress 1.5 (time 1.5 to 3.0 in the pinned sequence)
            pinTl.to(canvasContainerRef.current, {
                scale: 15,
                opacity: 0,
                ease: 'power2.inOut',
                duration: 1.5
            }, 1.5);

            // Smoothly fade in and zoom the full-screen carousel wrapper
            // Starts at timeline progress 1.3 (time 1.3 to 3.0 in the pinned sequence) to overlap smoothly with canvas
            pinTl.fromTo(carouselWrapperRef.current,
                { opacity: 0, scale: 0.96, pointerEvents: 'none' },
                { opacity: 1, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 1.7 },
                1.3
            );

        }, wrapperRef);

        return () => {
            window.removeEventListener('resize', handleResize);
            ctx.revert();
        };
    }, []);

    return (
        <div ref={wrapperRef} className="w-full relative">
            <section ref={sectionRef} className="w-full bg-[#eae7e2] overflow-hidden select-none">
                {/* Sticky Container */}
                <div ref={containerRef} className="h-screen w-full flex items-center justify-center overflow-hidden relative">

                    {/* 1. Canvas Centered Container (Gothic B Reveal) */}
                    <div
                        ref={canvasContainerRef}
                        className="absolute z-20 w-full h-full flex items-center justify-center pointer-events-none will-change-transform"
                    >
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>

                    {/* 2. Full-Screen Slideshow Carousel (Autoplays once revealed) */}
                    <div
                        ref={carouselWrapperRef}
                        className="absolute inset-0 flex flex-col justify-center z-10 opacity-0 pointer-events-none w-full h-full bg-[#08060d] will-change-transform"
                    >
                        {carouselImages.map((slide, idx) => (
                            <div
                                key={idx}
                                className={`carousel-slide absolute inset-0 w-full h-full transition-opacity duration-[1200ms] ease-in-out ${idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                {/* Full-screen Background Image */}
                                <img
                                    src={slide.src}
                                    alt={slide.title}
                                    className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.4] scale-100"
                                />

                                {/* Centered Overlay Text */}
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-12 bg-black/25 z-20">
                                    <span className="text-[10px] font-heading font-extrabold tracking-[0.35em] text-[#c99a4b] mb-4 uppercase opacity-0 slide-eyebrow">
                                        PORTFOLIO SHOWCASE
                                    </span>
                                    <h3 className="text-4xl md:text-7xl font-heading font-black tracking-tight text-white uppercase leading-none mb-6 opacity-0 slide-title select-none">
                                        {slide.title}
                                    </h3>
                                    <p className="font-serif italic text-lg md:text-2xl text-white/80 max-w-[650px] opacity-0 slide-tagline">
                                        {slide.tagline}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Progress Dots Indicators */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-auto">
                            {carouselImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 cursor-pointer ${idx === activeSlide ? 'bg-white w-6 rounded-sm' : 'bg-white/30'}`}
                                    onClick={() => setActiveSlide(idx)}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default SvgDraw;

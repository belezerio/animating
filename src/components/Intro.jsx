import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const videoContainerRef = useRef(null);
    const videoRef = useRef(null);
    const subtextRef = useRef(null);
    const btnRef = useRef(null);

    // Refs for the curtain overlay panels
    const titleCurtainLeftRef = useRef(null);
    const titleCurtainRightRef = useRef(null);
    const videoCurtainLeftRef = useRef(null);
    const videoCurtainRightRef = useRef(null);

    // Native React text splitter to prevent DOM mismatch errors during React render/unmount
    const splitText = (text, customClass = "") => {
        return text.split(" ").map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
                <span className={`split-word inline-block will-change-transform ${customClass}`}>
                    {word}
                </span>
            </span>
        ));
    };

    useEffect(() => {
        // Initialize GSAP ScrollTrigger context
        const ctx = gsap.context(() => {
            const words = titleRef.current.querySelectorAll('.split-word');

            // Set initial states
            gsap.set(words, { yPercent: 110 });
            gsap.set(videoContainerRef.current, { 
                scale: 0.85, 
                opacity: 0,
                yPercent: 15
            });
            gsap.set(videoRef.current, { scale: 1.25 });
            gsap.set(subtextRef.current, { opacity: 0, y: 30 });
            gsap.set(btnRef.current, { opacity: 0, y: 20 });

            // Pinned Master Scroll Timeline (Locks the section to allow slow, high-control reveal)
            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=150%', // Pins for 1.5 times the viewport height of scrolling
                    pin: true,
                    scrub: 1.5, // smooth scrub delay for a premium fluid feel
                    anticipatePin: 1
                }
            });

            masterTl
                // 1. Open Title curtains (slide left & right)
                .to(titleCurtainLeftRef.current, { xPercent: -101, ease: 'power1.inOut' }, 0)
                .to(titleCurtainRightRef.current, { xPercent: 101, ease: 'power1.inOut' }, 0)
                // Reveal title words stagger-up
                .to(words, {
                    yPercent: 0,
                    stagger: 0.05,
                    duration: 1.2,
                    ease: 'power2.out'
                }, 0.1)

                // 2. Open Video curtains (slide left & right)
                .to(videoCurtainLeftRef.current, { xPercent: -101, ease: 'power1.inOut' }, 0.2)
                .to(videoCurtainRightRef.current, { xPercent: 101, ease: 'power1.inOut' }, 0.2)
                // Fade in and scale up the video container wrapper
                .to(videoContainerRef.current, {
                    opacity: 1,
                    yPercent: 0,
                    scale: 1.0,
                    duration: 1.5,
                    ease: 'power3.out'
                }, 0.2)
                // Parallax zoom the video element (zoom out as container scales up)
                .to(videoRef.current, {
                    scale: 1.0,
                    duration: 2.0,
                    ease: 'none'
                }, 0.2)

                // 3. Parallax vertical shift of the title and video wrapper
                .to(titleRef.current, {
                    yPercent: -10,
                    duration: 2.0,
                    ease: 'none'
                }, 0.2)
                .to(videoContainerRef.current, {
                    yPercent: -6,
                    duration: 2.0,
                    ease: 'none'
                }, 0.2)

                // 4. Staggered fade in/slide up for description and button
                .to(subtextRef.current, {
                    opacity: 1,
                    y: 0,
                    yPercent: -5,
                    duration: 1.0,
                    ease: 'power2.out'
                }, 0.7)
                .to(btnRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, 0.9);

        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    // Loopable aesthetic black-and-white ink placeholder video
    const placeholderVideo = "https://assets.mixkit.co/videos/preview/mixkit-ink-in-water-4330-large.mp4";

    return (
        <section ref={sectionRef} className="intro-sec relative w-full h-screen overflow-hidden flex flex-col justify-center items-center py-12 px-6 md:px-12 bg-[#B9B5AB] text-[#08060d]">
            <div ref={containerRef} className="max-w-[1200px] w-full flex flex-col items-center text-center">
                
                {/* Title Text Wrapper (Contains left & right curtains) */}
                <div className="relative overflow-hidden mb-10 w-full flex justify-center">
                    {/* Left Curtain */}
                    <div 
                        ref={titleCurtainLeftRef} 
                        className="absolute top-0 left-0 w-1/2 h-full bg-[#eae7e2] z-20 will-change-transform" 
                    />
                    {/* Right Curtain */}
                    <div 
                        ref={titleCurtainRightRef} 
                        className="absolute top-0 right-0 w-1/2 h-full bg-[#eae7e2] z-20 will-change-transform" 
                    />

                    {/* Centered, stacked title */}
                    <h2 
                        ref={titleRef} 
                        className="font-heading font-black leading-[1.0] text-[6.5vw] md:text-[5vw] uppercase tracking-tighter select-none z-0"
                    >
                        <span className="block">{splitText("UNRIVALLED", "text-[#da8a91]")}</span>
                        <span className="block text-[#08060d]">{splitText("CREATIVITY.")}</span>
                        <span className="block text-[#08060d]">{splitText("GLOBAL REACH.")}</span>
                    </h2>
                </div>

                <div 
                    ref={videoContainerRef} 
                    className="z-10 w-[26vw] aspect-[1.35] min-w-[280px] max-w-[400px] overflow-hidden rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5 mb-12 relative"
                >
                    {/* Left Curtain */}
                    <div 
                        ref={videoCurtainLeftRef} 
                        className="absolute top-0 left-0 w-1/2 h-full bg-[#eae7e2] z-20 will-change-transform" 
                    />
                    {/* Right Curtain */}
                    <div 
                        ref={videoCurtainRightRef} 
                        className="absolute top-0 right-0 w-1/2 h-full bg-[#eae7e2] z-20 will-change-transform" 
                    />

                    <video
                        ref={videoRef}
                        src={placeholderVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover grayscale contrast-125 brightness-95 scale-110 will-change-transform z-0"
                    />
                </div>

                {/* Italicized Description */}
                <p 
                    ref={subtextRef} 
                    className="intro-subtext-italics text-center text-[1.3rem] md:text-[1.5rem] leading-relaxed max-w-[800px] mb-10 font-serif italic text-[#333] px-4"
                >
                    The world's largest independent brand agency.<br />
                    We drive growth, standout and fandom for the world's most desirable brands.
                </p>

                {/* About Us Button */}
                <button 
                    ref={btnRef} 
                    className="intro-btn px-10 py-3.5 border border-[#08060d] rounded-full font-heading font-bold text-xs tracking-[0.15em] uppercase hover:bg-[#08060d] hover:text-[#eae7e2] transition-colors duration-300 cursor-pointer"
                >
                    ABOUT US &rarr;
                </button>

            </div>
        </section>
    );
};

export default Intro;

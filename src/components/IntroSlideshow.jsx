import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    { 
        num: "01", 
        titleLines: ["ICE", "CHA", "LET"], 
        tagline: "Breaking the ice", 
        detail: "JOHNNIE WALKER BLUE LABEL LIMITED EDITION",
        img: "/assets/project_ice_chalet.png"
    },
    { 
        num: "02", 
        titleLines: ["TOB", "LER", "ONE"], 
        tagline: "Vibrant geometry", 
        detail: "A BOLD CLASSIC REIMAGINED",
        img: "/assets/project_toblerone.png"
    },
    { 
        num: "03", 
        titleLines: ["TA T", "E &", "L Y", "L E"], 
        tagline: "The Wonder of Science", 
        detail: "TATE & LYLE BRAND REFRESH",
        img: "/assets/intro_thumb.png"
    },
    { 
        num: "04", 
        titleLines: ["TEC", "A T", "E"], 
        tagline: "Forged in Mexican spirit", 
        detail: "TECATE BRAND EVOLUTION",
        img: "/assets/project_tecate.png"
    },
    { 
        num: "05", 
        titleLines: ["PEN", "FOL", "DS"], 
        tagline: "Luxury bottle branding", 
        detail: "PENFOLDS SHIRAZ GRANGE EDITION",
        img: "/assets/project_penfolds.png"
    }
];

const IntroSlideshow = () => {
    const containerRef = useRef(null);
    const pinWrapperRef = useRef(null);
    
    // Intro elements
    const titleRef = useRef(null);
    const introBgRef = useRef(null);
    const introContentRef = useRef(null);
    const introDescRef = useRef(null);
    const introBtnRef = useRef(null);
    const portalRef = useRef(null);
    const portalMediaRef = useRef(null);
    const strokePathRef = useRef(null);

    // Slideshow elements
    const slideRefs = useRef([]);
    const titleRefs = useRef([]);
    const taglineRefs = useRef([]);
    const mediaRefs = useRef([]);
    const bgContainerRefs = useRef([]);
    const hudRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(-1);

    const setSlideRef = (el, idx) => { slideRefs.current[idx] = el; };
    const setTitleRef = (el, idx) => { titleRefs.current[idx] = el; };
    const setTaglineRef = (el, idx) => { taglineRefs.current[idx] = el; };
    const setMediaRef = (el, idx) => { mediaRefs.current[idx] = el; };
    const setBgContainerRef = (el, idx) => { bgContainerRefs.current[idx] = el; };

    useEffect(() => {
        // 1. Split text for intro stagger reveal
        const textSplit = new SplitType(titleRef.current, {
            types: 'words,lines',
            lineClass: 'split-line',
            wordClass: 'split-word'
        });

        const strokePath = strokePathRef.current;
        let pathLength = 0;
        if (strokePath) {
            pathLength = strokePath.getTotalLength();
            gsap.set(strokePath, { 
                strokeDasharray: pathLength, 
                strokeDashoffset: pathLength 
            });
        }

        const slides = slideRefs.current;
        const total = slides.length;

        // Initialize slideshow states
        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });
        
        projects.forEach((_, idx) => {
            const titles = titleRefs.current[idx]?.querySelectorAll('h3 > span > span');
            const tagline = taglineRefs.current[idx];
            const media = mediaRefs.current[idx];
            if (titles) gsap.set(titles, { yPercent: 100, opacity: 0 });
            if (tagline) gsap.set(tagline, { yPercent: 40, opacity: 0 });
            if (media) gsap.set(media, { scale: 1.15, yPercent: 0 });
        });

        const ctx = gsap.context(() => {
            // Scroll trigger for intro words stagger reveal before pinning starts
            gsap.fromTo(textSplit.words,
                { translateY: '110%', opacity: 0 },
                {
                    translateY: '0%',
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.05,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                        end: 'top 20%',
                        scrub: 1
                    }
                }
            );

            // Master timeline for outline drawing, zooming B portal, and scrolling slideshow slides
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        // First 35% of progress is intro draw & zoom.
                        // Remaining 65% is slideshow slide scrolling.
                        const zoomProgress = 0.35;
                        if (self.progress < zoomProgress) {
                            setActiveIndex(-1);
                        } else {
                            const slideshowProgress = (self.progress - zoomProgress) / (1 - zoomProgress);
                            const idx = Math.min(
                                total - 1,
                                Math.floor(slideshowProgress * total)
                            );
                            setActiveIndex(idx);
                        }
                    }
                }
            });

            // --- PHASE 1: SVG OUTLINE DRAWING ---
            masterTimeline.to(strokePath, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: 'power1.inOut'
            });

            // --- PHASE 2: B-PORTAL ZOOM ---
            masterTimeline.to(portalRef.current, {
                scale: 45,
                ease: 'power2.in',
                duration: 2.0
            }, '+=0.1')
            .to(portalMediaRef.current, {
                scale: 0.0222, // Stabilize zoom: 1 / 45
                ease: 'power2.in',
                duration: 2.0
            }, '<')
            .to(strokePath, {
                opacity: 0,
                duration: 0.5
            }, '<')
            .to([titleRef.current, introDescRef.current, introBtnRef.current], {
                opacity: 0,
                yPercent: -20,
                stagger: 0.05,
                duration: 1.0
            }, '<')
            .to(introBgRef.current, {
                opacity: 0,
                duration: 1.5
            }, '<+=0.5')
            .to(introContentRef.current, {
                opacity: 0,
                duration: 1.0
            }, '>-0.5')
            .to(hudRef.current, {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.8
            }, '<');

            // --- PHASE 3: SLIDE 1 TEXT ENTERS ---
            const slide1Titles = titleRefs.current[0]?.querySelectorAll('h3 > span > span');
            const slide1Tagline = taglineRefs.current[0];
            const slide1Media = mediaRefs.current[0];
            
            masterTimeline
                .to(slide1Media, { scale: 1, duration: 1.5, ease: 'power2.out' }, '<')
                .to(slide1Titles, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1.2, ease: 'power3.out' }, '<+=0.2')
                .to(slide1Tagline, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '<');

            // --- PHASE 4: SLIDESHOW TRANSITIONS ---
            for (let i = 0; i < total - 1; i++) {
                const outgoingSlide = slides[i];
                const incomingSlide = slides[i + 1];

                const outgoingMedia = mediaRefs.current[i];
                const incomingMedia = mediaRefs.current[i + 1];

                const outgoingTitles = titleRefs.current[i]?.querySelectorAll('h3 > span > span');
                const incomingTitles = titleRefs.current[i + 1]?.querySelectorAll('h3 > span > span');

                const outgoingTagline = taglineRefs.current[i];
                const incomingTagline = taglineRefs.current[i + 1];

                masterTimeline
                    // Outgoing animations
                    .to(outgoingTitles, { yPercent: -100, opacity: 0, stagger: 0.05, duration: 1.0 }, `+=0.5`)
                    .to(outgoingTagline, { yPercent: -40, opacity: 0, duration: 1.0 }, '<')
                    .to(outgoingMedia, { scale: 0.95, yPercent: -5, opacity: 0, duration: 1.2 }, '<')
                    .to(outgoingSlide, { autoAlpha: 0, duration: 1.2 }, '<')

                    // Incoming animations
                    .to(incomingSlide, { autoAlpha: 1, duration: 0.5 }, '<+=0.2')
                    .to(incomingMedia, { scale: 1, yPercent: 0, opacity: 0.75, duration: 1.2, ease: 'power2.out' }, '<')
                    .to(incomingTitles, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1.2, ease: 'power3.out' }, '<+=0.2')
                    .to(incomingTagline, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '<');
            }

            // Slide backgrounds parallax effect
            bgContainerRefs.current.forEach((bgContainer, idx) => {
                if (bgContainer) {
                    gsap.to(bgContainer, {
                        yPercent: -10,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: () => `top+=${0.35 + (idx / total) * 0.65 * 100}% top`,
                            end: () => `top+=${0.35 + ((idx + 1) / total) * 0.65 * 100}% top`,
                            scrub: true
                        }
                    });
                }
            });

        }, containerRef);

        return () => {
            ctx.revert();
            textSplit.revert();
        };
    }, []);

    return (
        <section ref={containerRef} className="intro-slideshow-sec relative h-[700vh] bg-bg-dark text-text-white select-none z-10">
            <div ref={pinWrapperRef} className="sticky top-0 h-screen w-full overflow-hidden bg-bg-dark">
                {/* SVG responsive clipPath defs */}
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        <clipPath id="portal-b-clip" clipPathUnits="objectBoundingBox">
                            <path d="M 0.25, 0.083 L 0.55, 0.083 C 0.75, 0.083, 0.75, 0.458, 0.55, 0.458 C 0.78, 0.458, 0.78, 0.917, 0.50, 0.917 L 0.25, 0.917 Z" />
                        </clipPath>
                    </defs>
                </svg>

                {/* 1. Intro Section Overlay Layer */}
                <div ref={introBgRef} className="absolute inset-0 bg-bg-light z-10" />
                <div ref={introContentRef} className="absolute inset-0 z-20 flex flex-col justify-center items-center px-[5vw] text-text-black pointer-events-none">
                    <div className="max-w-[1000px] text-center flex flex-col items-center pointer-events-auto">
                        <h2 ref={titleRef} className="intro-title-line">
                            <span className="intro-pink">UNRIVALLED</span><br />
                            <span>CREATIVITY.</span><br />
                            <span>GLOBAL REACH.</span>
                        </h2>

                        {/* Pinned Portal Mask & Outline Stroke */}
                        <div ref={portalRef} className="intro-portal-container relative">
                            {/* SVG mask container */}
                            <div className="intro-portal-mask" style={{ clipPath: 'url(#portal-b-clip)' }}>
                                <div ref={portalMediaRef} className="w-full h-full" style={{ transform: 'scale(1)' }}>
                                    <video 
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline 
                                        poster="/assets/hero_bg.png"
                                        className="w-full h-full object-cover" 
                                    >
                                        <source src="/assets/hero.mp4" type="video/mp4" />
                                    </video>
                                </div>
                            </div>

                            {/* Vector Stroke Overlay */}
                            <svg viewBox="0 0 1 1" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                                <path 
                                    ref={strokePathRef}
                                    d="M 0.25, 0.083 L 0.55, 0.083 C 0.75, 0.083, 0.75, 0.458, 0.55, 0.458 C 0.78, 0.458, 0.78, 0.917, 0.50, 0.917 L 0.25, 0.917 Z"
                                    fill="none"
                                    stroke="#08060d"
                                    strokeWidth="0.003"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>

                        <p ref={introDescRef} className="intro-subtext-italics">
                            The world's largest independent brand agency. We drive growth, standout and fandom for the world's most desirable brands.
                        </p>

                        <button ref={introBtnRef} className="intro-btn">ABOUT US &rarr;</button>
                    </div>
                </div>

                {/* 2. Slideshow Project Layer */}
                <div className="relative w-full h-full z-0">
                    {projects.map((project, idx) => (
                        <div 
                            key={project.num} 
                            ref={(el) => setSlideRef(el, idx)} 
                            className={`slideshow-slide absolute inset-0 w-full h-full flex justify-between items-center px-[8vw] md:flex-row flex-col md:justify-between justify-center md:gap-0 gap-6 overflow-hidden`}
                        >
                            {/* Left Text Column */}
                            <div 
                                ref={(el) => setTitleRef(el, idx)} 
                                className="w-full md:w-[35vw] flex flex-col justify-center z-10 md:text-left text-center md:items-start items-center pointer-events-none"
                            >
                                <h3 className="slide-huge-title font-heading font-black text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter uppercase text-white drop-shadow-md">
                                    {project.titleLines.map((line, lIdx) => (
                                        <span key={lIdx} className="block overflow-hidden h-[13vw] md:h-[8.5vw]">
                                            <span className="inline-block will-change-transform">{line}</span>
                                        </span>
                                    ))}
                                </h3>
                            </div>

                            {/* Background Layer */}
                            <div 
                                ref={(el) => setBgContainerRef(el, idx)} 
                                className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
                            >
                                <img 
                                    ref={(el) => setMediaRef(el, idx)} 
                                    src={project.img} 
                                    alt={project.tagline}
                                    className="w-full h-full object-cover scale-100 will-change-transform opacity-75"
                                />
                                <div className="absolute inset-0 bg-black/45 z-10 pointer-events-none" />
                            </div>

                            {/* Right Text Column */}
                            <div 
                                ref={(el) => setTaglineRef(el, idx)} 
                                className="w-full md:w-[30vw] flex justify-center md:justify-end items-center md:text-right text-center z-10 pointer-events-none"
                            >
                                <div className="flex flex-col md:items-end items-center gap-2">
                                    <span className="slide-serif-tagline font-serif italic text-2xl md:text-[2.2vw] leading-tight text-white drop-shadow-sm">
                                        {project.tagline}
                                    </span>
                                    <span className="font-heading font-extrabold text-[9px] tracking-widest text-white/50 uppercase mt-2 hidden md:block">
                                        {project.detail}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Sticky HUD Overlays */}
                <div ref={hudRef} className="slideshow-controls-overlay absolute bottom-12 left-0 w-full flex justify-between items-center px-[8vw] font-heading font-extrabold text-[10px] tracking-widest text-white z-30 opacity-0 pointer-events-none">
                    <div className="ctrl-left opacity-60 hidden md:block">
                        FEATURED PROJECTS
                    </div>
                    <div className="ctrl-center-indicators flex gap-2 items-center">
                        {projects.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`ctrl-dot w-1.5 h-1.5 rounded-full bg-white/30 transition-all duration-400 ${activeIndex === idx ? 'dot-active bg-white w-6 rounded-sm' : ''}`}
                            ></div>
                        ))}
                    </div>
                    <a href="#all-work" className="ctrl-right-btn border border-white/30 px-6 py-2.5 rounded-full hover:bg-white hover:text-bg-dark transition-all duration-300 pointer-events-auto">
                        EXPLORE &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
};

export default IntroSlideshow;

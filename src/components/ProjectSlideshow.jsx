import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

const ProjectSlideshow = () => {
    const containerRef = useRef(null);
    const pinWrapperRef = useRef(null);
    const slideRefs = useRef([]);
    const titleRefs = useRef([]);
    const taglineRefs = useRef([]);
    const mediaRefs = useRef([]);
    const bgContainerRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const setSlideRef = (el, idx) => { slideRefs.current[idx] = el; };
    const setTitleRef = (el, idx) => { titleRefs.current[idx] = el; };
    const setTaglineRef = (el, idx) => { taglineRefs.current[idx] = el; };
    const setMediaRef = (el, idx) => { mediaRefs.current[idx] = el; };
    const setBgContainerRef = (el, idx) => { bgContainerRefs.current[idx] = el; };

    useEffect(() => {
        const slides = slideRefs.current;
        const total = slides.length;

        // Initialize active state for the first slide
        gsap.set(slides[0], { autoAlpha: 1, yPercent: 0 });
        gsap.set(mediaRefs.current[0], { scale: 1 });

        const ctx = gsap.context(() => {
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const index = Math.min(
                            total - 1,
                            Math.floor(self.progress * total)
                        );
                        setActiveIndex(index);
                    }
                }
            });

            // Cinematic full-screen transitions
            for (let i = 0; i < total - 1; i++) {
                const outgoingSlide = slides[i];
                const incomingSlide = slides[i + 1];

                const outgoingMedia = mediaRefs.current[i];
                const incomingMedia = mediaRefs.current[i + 1];

                const outgoingTitles = titleRefs.current[i]?.querySelectorAll('.title-row span');
                const incomingTitles = titleRefs.current[i + 1]?.querySelectorAll('.title-row span');

                const outgoingTagline = taglineRefs.current[i];
                const incomingTagline = taglineRefs.current[i + 1];

                gsap.set(incomingSlide, { autoAlpha: 0 });
                gsap.set(incomingMedia, { scale: 1.25, yPercent: 10 });
                if (incomingTitles) gsap.set(incomingTitles, { yPercent: 100, opacity: 0 });
                if (incomingTagline) gsap.set(incomingTagline, { yPercent: 40, opacity: 0 });

                masterTimeline
                    // Outgoing animations
                    .to(outgoingMedia, { scale: 0.95, yPercent: -5, autoAlpha: 0, duration: 1 }, `transition-${i}`)
                    .to(outgoingTitles, { yPercent: -100, opacity: 0, stagger: 0.05, duration: 0.8 }, `transition-${i}`)
                    .to(outgoingTagline, { yPercent: -40, opacity: 0, duration: 0.8 }, `transition-${i}`)
                    .to(outgoingSlide, { autoAlpha: 0, duration: 1 }, `transition-${i}`)

                    // Incoming animations
                    .to(incomingSlide, { autoAlpha: 1, duration: 1 }, `transition-${i}`)
                    .to(incomingMedia, { scale: 1, yPercent: 0, autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, `transition-${i}+=0.1`)
                    .to(incomingTitles, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1, ease: 'power3.out' }, `transition-${i}+=0.2`)
                    .to(incomingTagline, { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' }, `transition-${i}+=0.2`);
            }

            // Parallax movement inside backgrounds
            bgContainerRefs.current.forEach((bgContainer, idx) => {
                if (bgContainer) {
                    gsap.to(bgContainer, {
                        yPercent: -10,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: () => `top+=${(idx / total) * 100}% top`,
                            end: () => `top+=${((idx + 1) / total) * 100}% top`,
                            scrub: true
                        }
                    });
                }
            });

        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section ref={containerRef} className="slideshow-pinned-container relative h-[500vh] bg-bg-dark text-text-white z-10 select-none">
            <div ref={pinWrapperRef} className="slideshow-pin-wrapper sticky top-0 h-screen w-full overflow-hidden bg-bg-dark">
                <div className="relative w-full h-full">
                    {projects.map((project, idx) => (
                        <div 
                            key={project.num} 
                            ref={(el) => setSlideRef(el, idx)} 
                            className={`slideshow-slide absolute inset-0 w-full h-full flex justify-between items-center px-[8vw] md:flex-row flex-col md:justify-between justify-center md:gap-0 gap-6 overflow-hidden ${activeIndex === idx ? 'slide-active' : ''}`}
                        >
                            {/* Left Text Column: Stacked Big Letters (z-10, sits above full-screen background) */}
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

                            {/* Background Layer (Full-Screen Image) */}
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
                                {/* Dark overlay covering background for high text contrast */}
                                <div className="absolute inset-0 bg-black/45 z-10 pointer-events-none" />
                            </div>

                            {/* Right Text Column: Serif Italic Tagline (z-10, sits above full-screen background) */}
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

                {/* Sticky HUD Overlays (z-20) */}
                <div className="slideshow-controls-overlay layer-fg absolute bottom-12 left-0 w-full flex justify-between items-center px-[8vw] font-heading font-extrabold text-[10px] tracking-widest text-white z-20">
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

export default ProjectSlideshow;

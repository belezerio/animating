import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
    { num: "01", name: "ICE CHALET", img: "image1.jpg", tagline: "Breaking the ice" },
    { num: "02", name: "TATE & LYLE", img: "image3.jpg", tagline: "The Wonder of Science" },
    { num: "03", name: "OREO.COM", img: "image2.jpg", tagline: "Accept all cookies" },
    { num: "04", name: "TOBLERONE", img: "image4.jpg", tagline: "Vibrant geometry" },
    { num: "05", name: "TECATE", img: "image5.jpg", tagline: "Forged in Mexican spirit" }
];

const ProjectList = () => {
    const containerRef = useRef(null);
    const pinWrapperRef = useRef(null);
    const trackRef = useRef(null);
    const hudHeaderRef = useRef(null);
    const imageRefs = useRef([]);
    const itemRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const setItemRef = (el, idx) => { itemRefs.current[idx] = el; };
    const setImageRef = (el, idx) => { imageRefs.current[idx] = el; };

    useEffect(() => {
        const totalItems = items.length;
        const track = trackRef.current;
        const images = imageRefs.current;
        const textItems = itemRefs.current;

        const ctx = gsap.context(() => {
            // 1. Fade out the default header on scroll entry
            gsap.to('.main-header', {
                autoAlpha: 0,
                duration: 0.3,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 10%',
                    end: 'top -10%',
                    scrub: true
                }
            });

            // 2. Pinned timeline for vertical scrolling list
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: `+=${(totalItems - 1) * 100}%`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const idx = Math.min(totalItems - 1, Math.floor(progress * totalItems + 0.5));
                        setActiveIndex(idx);
                    }
                }
            });

            // Set initial state: first slide full, others masked
            gsap.set(images[0], { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', scale: 1, opacity: 1 });
            gsap.set(textItems[0], { opacity: 1 });
            
            for (let i = 1; i < totalItems; i++) {
                gsap.set(images[i], { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', scale: 1.15, opacity: 0 });
                gsap.set(textItems[i], { opacity: 0.08 });
            }

            // Animate transition steps
            for (let i = 0; i < totalItems - 1; i++) {
                const outgoingImg = images[i];
                const incomingImg = images[i + 1];

                const outgoingText = textItems[i];
                const incomingText = textItems[i + 1];

                const transitionLabel = `transition-${i}`;

                // Smoothly slide the text track up by one item height
                tl.to(track, {
                    y: () => {
                        const itemHeight = textItems[0]?.getBoundingClientRect().height || 0;
                        return -((i + 1) * itemHeight);
                    },
                    duration: 1,
                    ease: 'power1.inOut'
                }, transitionLabel)
                // Scrub text opacity
                .to(outgoingText, {
                    opacity: 0.08,
                    duration: 0.5
                }, transitionLabel)
                .to(incomingText, {
                    opacity: 1,
                    duration: 0.5
                }, transitionLabel)
                // Clip-wipe & zoom incoming image, scale down & fade outgoing image
                .to(outgoingImg, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.8,
                    ease: 'power2.inOut'
                }, transitionLabel)
                .to(incomingImg, {
                    opacity: 1,
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    scale: 1,
                    duration: 1,
                    ease: 'power2.out'
                }, transitionLabel + '+=0.1');

                // Animate blue HUD header to scroll away on first scroll transition
                if (i === 0) {
                    tl.to(hudHeaderRef.current, {
                        yPercent: -120,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.inOut'
                    }, transitionLabel);
                }
            }

        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section ref={containerRef} className="project-list-scroll-sec">
            <div ref={pinWrapperRef} className="project-list-sticky-wrapper">
                
                {/* Blue HUD Header */}
                <div ref={hudHeaderRef} className="list-hud-header">
                    <div className="hud-left">
                        <span className="hud-logo">BULLET<span className="logo-proof">PROOF</span></span>
                        <span className="hud-subtitle">FEATURED PROJECTS</span>
                        <a href="#all-work" className="hud-all-work-btn" onClick={(e) => e.preventDefault()}>ALL WORK &rarr;</a>
                    </div>
                    <div className="hud-center">
                        <span className="hud-index">{activeIndex + 1} / {items.length}</span>
                        <div className="hud-dots">
                            {items.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`hud-dot ${activeIndex === idx ? 'dot-active' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="hud-current-project">PROJECT {items[activeIndex].name}</span>
                    </div>
                    <div className="hud-right">
                        <nav className="hud-nav">
                            <a href="#work" className="hud-nav-item" onClick={(e) => e.preventDefault()}>WORK</a>
                            <a href="#about" className="hud-nav-item" onClick={(e) => e.preventDefault()}>ABOUT</a>
                            <a href="#news" className="hud-nav-item" onClick={(e) => e.preventDefault()}>NEWS</a>
                        </nav>
                        <a href="#explore" className="hud-explore-btn" onClick={(e) => e.preventDefault()}>EXPLORE &rarr;</a>
                    </div>
                </div>

                {/* Background Text Track */}
                <div ref={trackRef} className="project-text-track">
                    {items.map((item, idx) => (
                        <div 
                            key={idx}
                            ref={(el) => setItemRef(el, idx)}
                            className={`project-text-item ${activeIndex === idx ? 'item-active' : ''}`}
                        >
                            <span className="project-item-number">{item.num}</span>
                            <span className="project-item-name">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* Centered Overlay vertical preview container */}
                <div className="work-floating-center-container">
                    {items.map((item, idx) => (
                        <div 
                            key={idx}
                            ref={(el) => setImageRef(el, idx)}
                            className="work-floating-image" 
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                        >
                            <div className="media-placeholder" style={{ width: '100%', height: '100%' }}>
                                <div className="media-placeholder-label">[{item.img}]</div>
                                <div className="media-placeholder-tagline">{item.tagline}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* List Footer HUD Controls */}
                <div className="work-list-controls">
                    <div className="ctrl-list-grid">
                        <span style={{ cursor: 'pointer', borderBottom: '1px solid currentColor' }}>LIST</span>
                        <span style={{ cursor: 'pointer', color: '#888', marginLeft: '1.5rem' }}>GRID</span>
                    </div>
                    <a href="#all-work" className="ctrl-all-work" onClick={(e) => e.preventDefault()}>ALL WORK &rarr;</a>
                </div>

            </div>
        </section>
    );
};

export default ProjectList;

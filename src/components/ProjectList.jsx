import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
    { num: "01", name: "ICE CHALET", img: "/assets/project_ice_chalet.png", tagline: "Breaking the ice" },
    { num: "02", name: "TATE & LYLE", img: "/assets/intro_thumb.png", tagline: "The Wonder of Science" },
    { num: "03", name: "OREO", img: "/assets/project_tecate.png", tagline: "Accept all cookies" },
    { num: "04", name: "TOBLERONE", img: "/assets/project_toblerone.png", tagline: "Vibrant geometry" },
    { num: "05", name: "TECATE", img: "/assets/project_tecate.png", tagline: "Forged in Mexican spirit" },
    { num: "06", name: "PENFOLDS", img: "/assets/project_penfolds.png", tagline: "Luxury bottle branding" },
    { num: "07", name: "CADBURY", img: "/assets/project_toblerone.png", tagline: "Glass and a half" },
    { num: "08", name: "JOHNNIE WALKER", img: "/assets/project_ice_chalet.png", tagline: "Keep walking" },
    { num: "09", name: "HEINEKEN", img: "/assets/project_tecate.png", tagline: "Open your world" },
    { num: "10", name: "COCA-COLA", img: "/assets/project_penfolds.png", tagline: "Real magic" }
];

const ProjectList = () => {
    const containerRef = useRef(null);
    const pinWrapperRef = useRef(null);
    const trackRef = useRef(null);
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
                    end: `+=${totalItems * 100}%`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const idx = Math.min(totalItems - 1, Math.floor(progress * totalItems));
                        setActiveIndex(idx);
                    }
                }
            });

            // Set initial state: all images masked and hidden
            for (let i = 0; i < totalItems; i++) {
                gsap.set(images[i], { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', scale: 1.15, opacity: 0 });
                gsap.set(textItems[i], { opacity: 0.08 });
            }

            // Phase 1: Fade in the first project image & text at the start of scroll
            tl.to(images[0], {
                opacity: 1,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            }, 0)
            .to(textItems[0], {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            }, 0);

            // Phase 2: Animate transitions between items
            for (let i = 0; i < totalItems - 1; i++) {
                const outgoingImg = images[i];
                const incomingImg = images[i + 1];

                const outgoingText = textItems[i];
                const incomingText = textItems[i + 1];

                const startTime = 0.5 + i;

                // Smoothly slide the text track up by one item height
                tl.to(track, {
                    y: () => {
                        const itemHeight = textItems[0]?.getBoundingClientRect().height || 0;
                        return -((i + 1) * itemHeight);
                    },
                    duration: 1.0,
                    ease: 'power1.inOut'
                }, startTime)
                // Scrub text opacity
                .to(outgoingText, {
                    opacity: 0.08,
                    duration: 0.5
                }, startTime)
                .to(incomingText, {
                    opacity: 1,
                    duration: 0.5
                }, startTime)
                // Scale down and fade outgoing image, clip-wipe and zoom incoming image
                .to(outgoingImg, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.8,
                    ease: 'power2.inOut'
                }, startTime)
                .to(incomingImg, {
                    opacity: 1,
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    scale: 1,
                    duration: 1.0,
                    ease: 'power2.out'
                }, startTime + 0.1);
            }

            // Phase 3: Fade out the last project image & text at the end of scroll
            const endTime = 0.5 + (totalItems - 1);
            tl.to(images[totalItems - 1], {
                opacity: 0,
                scale: 0.9,
                duration: 0.5,
                ease: 'power2.in'
            }, endTime)
            .to(textItems[totalItems - 1], {
                opacity: 0.08,
                duration: 0.5,
                ease: 'power2.in'
            }, endTime);

        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section ref={containerRef} className="project-list-scroll-sec">
            <div ref={pinWrapperRef} className="project-list-sticky-wrapper">
                
                {/* Background Text Track */}
                <div ref={trackRef} className="project-text-track">
                    {items.map((item, idx) => (
                        <div 
                            key={idx}
                            ref={(el) => setItemRef(el, idx)}
                            className={`project-text-item ${activeIndex === idx ? 'item-active' : ''}`}
                            style={{
                                transform: idx % 3 === 0 ? 'translateX(-12vw)' : idx % 3 === 1 ? 'translateX(12vw)' : 'none'
                            }}
                        >
                            <span className="project-item-number">{item.num}</span>
                            <span className="project-item-name">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* Centered Overlay vertical preview container */}
                <div className="work-floating-center-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
                    {items.map((item, idx) => {
                        return (
                            <div
                                key={idx}
                                style={{
                                    width: '25vw',
                                    height: '60vh',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    overflow: 'hidden'
                                }}
                            >
                                <div 
                                    ref={(el) => setImageRef(el, idx)}
                                    className="work-floating-image" 
                                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                                >
                                    <div className="w-full h-full relative bg-[#121214]">
                                        <img 
                                            src={item.img} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                        <div className="media-placeholder-tagline">{item.tagline}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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

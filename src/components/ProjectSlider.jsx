import React, { useEffect, useRef } from 'react';

const ProjectSlider = () => {
    const containerRef = useRef(null);
    const sliderRef = useRef(null);
    const cardRefs = useRef([]);

    // Helper to store card element refs dynamically
    const setCardRef = (el, idx) => {
        if (el) cardRefs.current[idx] = el;
    };

    useEffect(() => {
        let isTicking = false;

        const onScroll = () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const viewportHeight = window.innerHeight;
                    const viewportWidth = window.innerWidth;
                    
                    if (containerRef.current && sliderRef.current) {
                        const offsetTop = containerRef.current.offsetTop;
                        const totalHeight = containerRef.current.offsetHeight;
                        const scrollDistance = totalHeight - viewportHeight;
                        
                        // Check if container is in vertical scroll range
                        if (scrollY >= offsetTop && scrollY <= offsetTop + scrollDistance) {
                            const relativeScroll = scrollY - offsetTop;
                            const scrollPercent = relativeScroll / scrollDistance;
                            
                            const maxTranslate = sliderRef.current.offsetWidth - viewportWidth;
                            const translateAmount = scrollPercent * maxTranslate;
                            
                            sliderRef.current.style.transform = `translateX(-${translateAmount}px)`;
                            
                            // Parallax shifting inside project cards
                            cardRefs.current.forEach(card => {
                                if (card) {
                                    const cardBg = card.querySelector('.card-bg');
                                    if (cardBg) {
                                        const cardRect = card.getBoundingClientRect();
                                        const cardCenter = cardRect.left + cardRect.width / 2;
                                        const screenCenter = viewportWidth / 2;
                                        const offsetFromCenter = cardCenter - screenCenter;
                                        const progress = offsetFromCenter / viewportWidth;
                                        
                                        const parallaxShift = progress * 15; // Shift from -15% to 15%
                                        cardBg.style.transform = `translateX(${parallaxShift}%)`;
                                    }
                                }
                            });
                        } else if (scrollY < offsetTop) {
                            sliderRef.current.style.transform = 'translateX(0px)';
                            cardRefs.current.forEach(card => {
                                if (card) {
                                    const cardBg = card.querySelector('.card-bg');
                                    if (cardBg) cardBg.style.transform = 'translateX(-10%)';
                                }
                            });
                        } else if (scrollY > offsetTop + scrollDistance) {
                            const maxTranslate = sliderRef.current.offsetWidth - viewportWidth;
                            sliderRef.current.style.transform = `translateX(-${maxTranslate}px)`;
                            cardRefs.current.forEach(card => {
                                if (card) {
                                    const cardBg = card.querySelector('.card-bg');
                                    if (cardBg) cardBg.style.transform = 'translateX(10%)';
                                }
                            });
                        }
                    }
                    isTicking = false;
                });
                isTicking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const projects = [
        { num: "01", name: "ICE CHALET", img: "/assets/project_ice_chalet.png" },
        { num: "02", name: "TOBLERONE", img: "/assets/project_toblerone.png" },
        { num: "03", name: "TECATE", img: "/assets/project_tecate.png" },
        { num: "04", name: "PENFOLDS", img: "/assets/project_penfolds.png" }
    ];

    return (
        <section ref={containerRef} id="work" className="horizontal-scroll-container">
            <div className="pin-wrapper">
                <div ref={sliderRef} className="horizontal-slider">
                    <div className="slide intro-slide">
                        <h2 className="slide-main-title">SELECTED<br />WORK</h2>
                        <p className="slide-subtitle">A collection of category-defining brand designs.</p>
                    </div>
                    
                    {projects.map((project, idx) => (
                        <div 
                            key={project.name} 
                            ref={(el) => setCardRef(el, idx)} 
                            className="slide project-card"
                        >
                            <div 
                                className="card-bg" 
                                style={{ backgroundImage: `url('${project.img}')` }}
                            ></div>
                            <div className="card-overlay"></div>
                            <div className="card-content">
                                <span className="project-num">{project.num} / {project.name}</span>
                                <h3 className="project-title">{project.name}</h3>
                                <a href="#" className="card-link">EXPLORE <span className="arrow">&rarr;</span></a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectSlider;

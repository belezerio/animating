import React, { useEffect, useRef } from 'react';

const SvgDraw = () => {
    const pathRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        let pathLength = 0;
        if (pathRef.current) {
            pathLength = pathRef.current.getTotalLength();
            pathRef.current.style.strokeDasharray = pathLength;
            pathRef.current.style.strokeDashoffset = pathLength;
        }

        let isTicking = false;

        const onScroll = () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    if (pathRef.current && sectionRef.current) {
                        const rect = sectionRef.current.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        
                        if (rect.top < viewportHeight && rect.bottom > 0) {
                            const totalScrollArea = viewportHeight + rect.height;
                            const currentScroll = viewportHeight - rect.top;
                            let scrollPercent = currentScroll / totalScrollArea;
                            scrollPercent = Math.max(0, Math.min(1, scrollPercent));
                            
                            // Map to drawing offset (start drawing at 25% scroll of section, finish at 75%)
                            let drawPercent = (scrollPercent - 0.25) / 0.50;
                            drawPercent = Math.max(0, Math.min(1, drawPercent));
                            
                            pathRef.current.style.strokeDashoffset = pathLength * (1 - drawPercent);
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

    return (
        <section ref={sectionRef} className="svg-draw-section">
            <div className="svg-container">
                <svg viewBox="0 0 100 120" className="drawing-svg">
                    <path 
                        ref={pathRef} 
                        className="drawing-path" 
                        d="M 25 10 H 55 C 75 10, 75 55, 55 55 C 78 55, 78 110, 50 110 H 25 V 10 Z" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <div className="svg-label reveal-section">
                <h3>BUILT FOR IMPACT</h3>
                <p>Bold outlines. Structured design. Uncompromising execution.</p>
            </div>
        </section>
    );
};

export default SvgDraw;

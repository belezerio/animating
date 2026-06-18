import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Large backdrop letters scale and slide upwards on entry
            gsap.fromTo(textRef.current,
                { yPercent: 40, scale: 0.88, opacity: 0.1 },
                {
                    yPercent: 0,
                    scale: 1,
                    opacity: 0.5,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: true
                    }
                }
            );
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <footer ref={sectionRef} className="footer-sec">
            {/* Grid Top Columns */}
            <div className="footer-grid-top">
                <div className="footer-col-item">
                    <h4>CONNECT</h4>
                    <div className="footer-col-links">
                        <a href="mailto:hello@wearebulletproof.com">GET IN TOUCH</a>
                        <a href="#">INSTAGRAM</a>
                        <a href="#">LINKEDIN</a>
                    </div>
                </div>
                <div className="footer-col-item">
                    <h4>NAVIGATE</h4>
                    <div className="footer-col-links">
                        <a href="#">HOME</a>
                        <a href="#work">WORK</a>
                        <a href="#about">ABOUT</a>
                        <a href="#news">NEWS</a>
                    </div>
                </div>
                <div className="footer-col-item">
                    <h4>NEWSLETTER</h4>
                    <div className="footer-col-links">
                        <p>BE IN THE KNOW</p>
                        <button className="footer-newsletter-btn" onClick={(e) => e.preventDefault()}>
                            SUBSCRIBE &rarr;
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop scaling typography */}
            <div className="footer-backdrop-wrapper">
                <div ref={textRef} className="footer-large-logo">
                    BULLETPROOF
                </div>
            </div>

            {/* Office Locations */}
            <div className="footer-office-location">
                UK LONDON &bull; US NEW YORK &bull; SG SINGAPORE &bull; NL AMSTERDAM &bull; AU SYDNEY &bull; CN SHANGHAI &bull; AU MELBOURNE &bull; UAE DUBAI
            </div>

            {/* Bottom meta info */}
            <div className="footer-bottom-info">
                <span>PRIVACY &bull; TERMS &bull; COOKIES</span>
                <span>&copy; BULLETPROOF 2026. ALL RIGHTS RESERVED</span>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const newsItems = [
    {
        meta: "PRESS",
        title: "Why Dove is betting on hundreds of creators for the World Cup",
        img: "image1.jpg"
    },
    {
        meta: "PRESS",
        title: "Bulletproof sparks a new wave of coffee culture for L'OR Espresso",
        img: "image2.jpg"
    },
    {
        meta: "THINKING",
        title: "5 Moves for Middle East Business Leaders Navigating Uncertainty and Disruption",
        img: "image3.jpg"
    },
    {
        meta: "PRESS",
        title: "Bulletproof named design agency partner of the year in Northern Europe",
        img: "image4.jpg"
    },
    {
        meta: "THINKING",
        title: "Visualizing the future of category design under AI integrations",
        img: "image5.jpg"
    }
];

const cities = ["LONDON", "NEW YORK", "SINGAPORE", "SYDNEY", "AMSTERDAM", "TOKYO", "BERLIN", "SHANGHAI", "MUMBAI"];

const NewsMarquee = () => {
    const sectionRef = useRef(null);
    const pinWrapperRef = useRef(null);
    const trackRef = useRef(null);
    const tickerRef = useRef(null);
    const cardMediaRefs = useRef([]);

    const setCardMediaRef = (el, idx) => { cardMediaRefs.current[idx] = el; };

    useEffect(() => {
        const track = trackRef.current;
        const cardMedias = cardMediaRefs.current;

        const ctx = gsap.context(() => {
            if (track) {
                const maxScroll = track.scrollWidth - window.innerWidth;

                // Horizontal pin scroll for News Cards
                gsap.to(track, {
                    x: -maxScroll,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: () => `+=${maxScroll}`,
                        pin: true,
                        scrub: true,
                        anticipatePin: 1
                    }
                });

                // Inner card media parallax translations (bg shifts slightly in opposite direction)
                cardMedias.forEach(media => {
                    if (media) {
                        const img = media.querySelector('.media-placeholder');
                        gsap.fromTo(img,
                            { xPercent: -10 },
                            {
                                xPercent: 10,
                                ease: 'none',
                                scrollTrigger: {
                                    trigger: media,
                                    containerAnimation: gsap.getById('news-horizontal-pin'), // or simple tracking
                                    start: 'left right',
                                    end: 'right left',
                                    scrub: true
                                }
                            }
                        );
                    }
                });
            }

            // Endless smooth marquee ticker animation
            if (tickerRef.current) {
                const totalWidth = tickerRef.current.scrollWidth;
                gsap.to(tickerRef.current, {
                    x: -totalWidth / 2,
                    duration: 25,
                    ease: 'none',
                    repeat: -1
                });
            }
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div ref={sectionRef}>
            {/* Section 5: News horizontal scroll */}
            <section className="news-sec">
                <div ref={pinWrapperRef} className="news-pinned-wrapper">
                    <div ref={trackRef} className="news-slider-track">
                        {newsItems.map((item, idx) => (
                            <div key={idx} className="news-card-slide">
                                <div 
                                    ref={(el) => setCardMediaRef(el, idx)} 
                                    className="news-card-media"
                                >
                                    <div className="media-placeholder" style={{ width: '120%', height: '100%', left: '-10%' }}>
                                        <div className="media-placeholder-label">[{item.img}]</div>
                                    </div>
                                </div>
                                <span className="news-card-meta">{item.meta}</span>
                                <h4 className="news-card-title">{item.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 6: Horizontal City Ticker */}
            <section className="horizontal-ticker-sec">
                <div ref={tickerRef} className="horizontal-ticker-track">
                    {/* Duplicate list to enable continuous looping */}
                    {cities.map((city, idx) => (
                        <div key={idx} className="ticker-city-word">{city}</div>
                    ))}
                    {cities.map((city, idx) => (
                        <div key={`dup-${idx}`} className="ticker-city-word">{city}</div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default NewsMarquee;

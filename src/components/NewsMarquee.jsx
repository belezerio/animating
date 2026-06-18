import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const newsItems = [
    {
        meta: "PRESS",
        title: "Why Dove is betting on hundreds of creators for the World Cup",
        img: "/assets/project_penfolds.png"
    },
    {
        meta: "PRESS",
        title: "Bulletproof sparks a new wave of coffee culture for L'OR Espresso",
        img: "/assets/intro_thumb.png"
    },
    {
        meta: "THINKING",
        title: "5 Moves for Middle East Business Leaders Navigating Uncertainty and Disruption",
        img: "/assets/ticker_bg.png"
    },
    {
        meta: "PRESS",
        title: "Bulletproof named design agency partner of the year in Northern Europe",
        img: "/assets/project_toblerone.png"
    },
    {
        meta: "THINKING",
        title: "Visualizing the future of category design under AI integrations",
        img: "/assets/project_tecate.png"
    }
];

const cities = ["LONDON", "NEW YORK", "SINGAPORE", "SYDNEY", "AMSTERDAM", "TOKYO", "BERLIN", "SHANGHAI", "MUMBAI"];

const NewsMarquee = () => {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const tickerRef = useRef(null);

    const headerWords = ["ALWAYS", "MAKING", "HEADLINES", "ALWAYS", "MAKING"];

    useEffect(() => {
        const track = trackRef.current;

        const ctx = gsap.context(() => {
            // Endless smooth horizontal automatic rolling marquee for news cards track
            if (track) {
                const totalWidth = track.scrollWidth;
                gsap.to(track, {
                    x: -totalWidth / 2,
                    duration: 35,
                    ease: 'none',
                    repeat: -1
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
            {/* Section 5: News horizontal marquee */}
            <section className="news-sec">
                <div className="w-full overflow-hidden">
                    <div ref={trackRef} className="news-slider-track flex flex-row w-max">
                        {newsItems.map((item, idx) => (
                            <div key={idx} className="news-card-slide flex-shrink-0">
                                {headerWords[idx] && (
                                    <h2 className="news-marquee-word font-heading font-black text-5xl md:text-[5.5vw] text-[#eae7e2] tracking-tight uppercase mb-8 select-none leading-none">
                                        {headerWords[idx]}
                                    </h2>
                                )}
                                <div className="news-card-media">
                                    <div className="w-full h-full relative">
                                        <img 
                                            src={item.img} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                </div>
                                <span className="news-card-meta">{item.meta}</span>
                                <h4 className="news-card-title">{item.title}</h4>
                            </div>
                        ))}
                        {/* Duplicate the array items for continuous looping */}
                        {newsItems.map((item, idx) => (
                            <div key={`dup-${idx}`} className="news-card-slide flex-shrink-0">
                                {headerWords[idx] && (
                                    <h2 className="news-marquee-word font-heading font-black text-5xl md:text-[5.5vw] text-[#eae7e2] tracking-tight uppercase mb-8 select-none leading-none">
                                        {headerWords[idx]}
                                    </h2>
                                )}
                                <div className="news-card-media">
                                    <div className="w-full h-full relative">
                                        <img 
                                            src={item.img} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover" 
                                        />
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

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './components/Header';
import Hero from './components/Hero';
import Intro from './components/Intro';
import SvgDraw from './components/SvgDraw';
import ProjectList from './components/ProjectList';
import NewsMarquee from './components/NewsMarquee';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
    useEffect(() => {
        // 1. Initialize Lenis smooth scroll globally
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.1
        });

        // 2. Connect Lenis scrolling updates to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // 3. Global fade-in reveals for standard elements (reveal-section)
        const revealElements = document.querySelectorAll('.reveal-section');
        revealElements.forEach(el => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <>
            <Header />
            <main>
                <Hero />
                <Intro />
                <SvgDraw />
                <ProjectList />
                <NewsMarquee />
            </main>
            <Footer />
        </>
    );
}

export default App;

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const scrollIndRef = useRef(null);

  useEffect(() => {
    const words = headlineRef.current.querySelectorAll('.word-reveal');
    const leftWords = headlineRef.current.querySelectorAll('.word-left');
    const rightWords = headlineRef.current.querySelectorAll('.word-right');

    const ctx = gsap.context(() => {
      // ---- Load-in sequence: plays once when the page opens ----
      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      })
        .to(
          words,
          { '--p': 0, duration: 1.3, ease: 'power3.out', stagger: 0.12 },
          0.15
        )
        .to(
          scrollIndRef.current,
          { opacity: 1, duration: 0.6, ease: 'power1.out' },
          '>-0.4'
        );

      // ---- Scroll-driven text split (no pinning, video scrolls up normally) ----
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      scrollTl
        // Animate left words outward and fade out
        .to(leftWords, {
          x: -240,
          opacity: 0,
          ease: 'none'
        }, 0)
        // Animate right words outward and fade out
        .to(rightWords, {
          x: 240,
          opacity: 0,
          ease: 'none'
        }, 0)
        // Fade out eyebrow and lift it
        .to(eyebrowRef.current, {
          y: -40,
          opacity: 0,
          ease: 'none'
        }, 0)
        // Fade out scroll indicator quickly
        .to(scrollIndRef.current, {
          opacity: 0,
          y: 20,
          ease: 'none'
        }, 0);

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-[#150c0e] text-[#f6f3ec] will-change-transform"
    >
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        poster="/assets/hero_bg.png"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0608] via-[#0b0608]/30 to-[#0b0608]/60" />

      <div className="relative z-10 flex h-full flex-col justify-end px-12 sm:px-[6vw] lg:px-[8vw] pb-28 w-full">
        <span
          ref={eyebrowRef}
          className="mb-6 -translate-y-2 text-xs font-medium uppercase tracking-[0.35em] text-[#c99a4b] opacity-0 sm:text-sm"
        >
          An Independent Creative Studio
        </span>

        <h1
          ref={headlineRef}
          className="grid grid-cols-2 gap-y-2 font-display font-extrabold uppercase leading-[0.92] tracking-tight"
        >
          <span
            className="word-reveal word-left justify-self-start text-[10vw] sm:text-[7.5vw] lg:text-[5.4vw]"
            style={{ '--p': 1 }}
          >
            CREATE
          </span>
          <span
            className="word-reveal word-right justify-self-end text-[10vw] sm:text-[7.5vw] lg:text-[5.4vw]"
            style={{ '--p': 1 }}
          >
            THROUGH
          </span>
          <span
            className="word-reveal word-left justify-self-start text-[10vw] sm:text-[7.5vw] lg:text-[5.4vw]"
            style={{ '--p': 1 }}
          >
            DESIRE
          </span>
          <span
            className="word-reveal word-right justify-self-end text-[#c99a4b] text-[10vw] sm:text-[7.5vw] lg:text-[5.4vw]"
            style={{ '--p': 1 }}
          >
            DISRUPTION
          </span>
        </h1>
      </div>

      <div
        ref={scrollIndRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0"
      >
        <span className="mouse-icon">
          <span className="wheel" />
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#f6f3ec]/70">
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Hero;
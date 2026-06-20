"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import KojiMascot from "../KojiMascot";

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const landingRef = useRef<HTMLElement | null>(null);
  const [cursor, setCursor] = useState({ x: 120, y: 120 });
  const [subject, setSubject] = useState<"Math" | "CS" | "Science" | "Data">("Math");

  const subjectData = {
    Math: { title: "Quadratics", heading: "Covered subjects", items: ["Arithmetic Thinking", "Proportional Reasoning", "Probability and Chance"], tone: "math" },
    CS: { title: "Computer Science", heading: "Build programs visually", items: ["Logic and Loops", "Algorithms", "Python Fundamentals"], tone: "cs" },
    Science: { title: "Science", heading: "Explore systems", items: ["Forces and Motion", "Electricity", "Scientific Thinking"], tone: "science" },
    Data: { title: "Data", heading: "Think with evidence", items: ["Statistics", "Data Visualization", "Probability Models"], tone: "data" },
  }[subject];

  useEffect(() => {
    let cleanup = () => {};
    let mounted = true;
    (async () => {
      const gsapModule = await import("gsap");
      const scrollModule = await import("gsap/ScrollTrigger");
      if (!mounted || !landingRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((item, index) => {
          gsap.fromTo(item, { y: 34, opacity: 0, filter: "blur(8px)" }, {
            y: 0, opacity: 1, filter: "blur(0px)", duration: .85, delay: (index % 4) * .04, ease: "power3.out",
            immediateRender: false, clearProps: "transform,filter,opacity",
            scrollTrigger: { trigger: item, start: "top 92%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((section) => {
          gsap.fromTo(section, { y: 42 }, {
            y: 0, duration: 1.05, ease: "power3.out", immediateRender: false, clearProps: "transform",
            scrollTrigger: { trigger: section, start: "top 86%", once: true },
          });
        });
        if (landingRef.current?.querySelector(".floating-lesson-card")) gsap.to(".floating-lesson-card", { y: -18, rotate: -1.6, duration: 3.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
        if (landingRef.current?.querySelector(".koji-badge")) gsap.to(".koji-badge", { y: -14, x: 6, rotate: 3, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
        if (landingRef.current?.querySelector(".b-hero-visual") && landingRef.current?.querySelector(".b-hero")) gsap.to(".b-hero-visual", { yPercent: -6, ease: "none", scrollTrigger: { trigger: ".b-hero", start: "top top", end: "bottom top", scrub: 1.2 } });
        if (landingRef.current?.querySelector(".math-demo-card") && landingRef.current?.querySelector(".koji-section")) gsap.to(".math-demo-card", { y: -28, ease: "none", scrollTrigger: { trigger: ".koji-section", start: "top bottom", end: "bottom top", scrub: 1.4 } });
        if (landingRef.current?.querySelector(".quadratic-demo") && landingRef.current?.querySelector(".subjects-section")) gsap.to(".quadratic-demo", { rotate: .8, y: -18, ease: "none", scrollTrigger: { trigger: ".subjects-section", start: "top bottom", end: "bottom top", scrub: 1.2 } });
      }, landingRef);
      cleanup = () => ctx.revert();
    })();
    return () => { mounted = false; cleanup(); };
  }, []);

  void subjectData;
  void setSubject;

  return (
    <motion.main
      ref={landingRef}
      className="brilliant-landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
    >
      <motion.div className="live-cursor-orb" animate={{ x: cursor.x - 18, y: cursor.y - 18 }} transition={{ type: "spring", stiffness: 95, damping: 22, mass: .55 }} aria-hidden="true" />
      <motion.svg className="live-cursor-svg" viewBox="0 0 64 64" animate={{ x: cursor.x + 14, y: cursor.y + 10, rotate: [-8, -2, -8] }} transition={{ x: { type: "spring", stiffness: 120, damping: 20 }, y: { type: "spring", stiffness: 120, damping: 20 }, rotate: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }} aria-hidden="true">
        <path d="M10 6L54 38L34 43L25 61L10 6Z" fill="#111" />
        <path d="M14 13L47 36L30 39L24 52L14 13Z" fill="#fff" />
      </motion.svg>
      <motion.nav className="b-landing-nav" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
        <div className="b-logo"><img src="/agathon-mark.png" alt="" className="b-logo-mark" />Agathon</div>
        <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} className="b-nav-ghost">Sign in</motion.button>
        <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} className="b-nav-solid" onClick={onStart}>Get started</motion.button>
      </motion.nav>

      <section className="b-hero desktop-brilliant-hero">
        <motion.div className="b-hero-copy" initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1, duration: .65, ease: [0.22, 1, 0.36, 1] }}>
          <h1>A world-class tutor for every home</h1>
          <p>Your personal tutor for math and coding. Built by top learning experts from MIT and Harvard.</p>
          <motion.button whileHover={{ scale: 1.018, y: -2 }} whileTap={{ scale: 0.985 }} className="learner-cta" onClick={onStart}>Get Started</motion.button>
        </motion.div>
        <motion.div className="b-hero-visual" initial={{ y: 28, opacity: 0, scale: .985 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>
          <div className="hero-photo-scene learning-only-scene">
            <div className="learning-orb one" />
            <div className="learning-orb two" />
            <div className="learning-dashboard">
              <div className="dash-top"><span>Interactive lesson</span><b>Level 1</b></div>
              <div className="dash-grid">
                <div className="dash-equation">x + y ≤ 4</div>
                <div className="dash-code"><i/> drive forward<br/><i/> deliver package</div>
                <div className="dash-progress"><span style={{ width: "72%" }} /></div>
              </div>
            </div>
          </div>
          <div className="hero-question">How many marbles make<br/>a total volume of 40?</div>
          <div className="floating-lesson-card hero-graph-card">
            <div className="graph-title">Volume</div>
            <svg viewBox="0 0 280 260" className="graph-demo" aria-hidden="true">
              <defs><pattern id="gridHero" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#e9edf1" strokeWidth="1"/></pattern></defs>
              <rect x="28" y="18" width="190" height="190" fill="url(#gridHero)"/>
              <path d="M38 208H226M48 218V22" stroke="#111" strokeWidth="2"/>
              <path d="M42 184C82 158 126 134 174 108" stroke="#3e74d7" strokeWidth="3" fill="none" strokeLinecap="round"/>
              {[0,1,2,3,4,5].map((dot) => <circle key={dot} cx={48 + dot * 28} cy={178 - dot * 14} r="4" fill="#3368c7"/>)}
              <rect x="204" y="96" width="54" height="112" fill="#b8d2ff" stroke="#111" strokeWidth="2"/>
              {[0,1,2,3,4,5,6].map((m) => <circle key={m} cx={214 + (m % 3) * 16} cy={116 + Math.floor(m / 3) * 28} r="9" fill="#ef6bb8" opacity=".9"/>)}
            </svg>
            <svg className="card-real-cursor hero-card-cursor" viewBox="0 0 64 72" aria-hidden="true">
              <path className="cursor-fill" d="M9 5L55 42L34 47L24 68L9 5Z" />
              <path className="cursor-edge" d="M9 5L55 42L34 47L24 68L9 5Z" />
              <path className="cursor-shine" d="M17 17L41 37L29 40L23 53L17 17Z" />
            </svg>
          </div>
          <KojiMascot className="koji-badge" mood="teaching" isTeaching />
        </motion.div>
      </section>

      <section className="stats-row gsap-section">
        <motion.div className="stat-pill-card gsap-reveal" whileHover={{ y: -5, scale: 1.01 }}>
          <span className="stat-icon editors-choice">‹ Editors’ Choice ›</span>
          <h2>Award-winning</h2>
          <p>learning that’s effective and fun</p>
        </motion.div>
        <motion.div className="stat-pill-card gsap-reveal" whileHover={{ y: -5, scale: 1.01 }}>
          <span className="stat-stars">★★★★★</span>
          <h2>100,000+</h2>
          <p>5-star app store reviews</p>
        </motion.div>
        <motion.div className="stat-pill-card gsap-reveal" whileHover={{ y: -5, scale: 1.01 }}>
          <span className="stat-icon">🌎</span>
          <h2>10 million+</h2>
          <p>learners around the world</p>
        </motion.div>
      </section>

      <section className="koji-intro gsap-section">
        <div className="koji-beam"><KojiMascot className="green-mascot" mood="idle" /></div>
        <h2>Meet Koji, your personal tutor</h2>
      </section>

      <section className="feature-row feature-concepts gsap-section">
        <motion.div className="feature-art pale-blue" whileHover={{ y: -8, scale: 1.01 }} transition={{ type: "spring", stiffness: 90, damping: 18 }}>
          <div className="white-demo-card graph-window">
            <div className="math-title">x + y ≤ 4</div>
            <div className="axis-plane"><span/><span/><span/><span/><span/><span/></div>
            <KojiMascot className="koji-mini" mood="thinking" />
            <svg className="card-real-cursor feature-cursor" viewBox="0 0 64 72" aria-hidden="true"><path className="cursor-fill" d="M9 5L55 42L34 47L24 68L9 5Z"/><path className="cursor-edge" d="M9 5L55 42L34 47L24 68L9 5Z"/><path className="cursor-shine" d="M17 17L41 37L29 40L23 53L17 17Z"/></svg>
          </div>
        </motion.div>
        <div className="feature-copy gsap-reveal">
          <h3>Concepts that click</h3>
          <p>Every session is visual and interactive. Instead of just memorizing, you play with concepts until they click. And you work through problems step-by-step, building your intuition along the way.</p>
        </div>
      </section>

      <section className="feature-row feature-think reverse gsap-section">
        <div className="feature-copy gsap-reveal">
          <h3>Built to make you <em>think</em></h3>
          <p>Like the best human tutors, Koji asks the right questions, provides visual guidance, and gets to the heart of where you’re getting stuck. It’s the difference between getting the answer and actually understanding it.</p>
        </div>
        <motion.div className="feature-art pale-peach" whileHover={{ y: -8, scale: 1.01 }} transition={{ type: "spring", stiffness: 90, damping: 18 }}>
          <div className="equation-card">
            <KojiMascot className="koji-mini eq-koji" mood="idle" />
            <div className="equation-top">(x + 4) (x + 2)</div>
            <div className="equation-main">= x² + <b>2x</b> + <i/> + <i/></div>
            <div className="answer-row"><span/> <button>4x</button><button>8x</button><button>2</button><button>4</button><button>8</button></div>
            <svg className="card-real-cursor equation-cursor" viewBox="0 0 64 72" aria-hidden="true"><path className="cursor-fill" d="M9 5L55 42L34 47L24 68L9 5Z"/><path className="cursor-edge" d="M9 5L55 42L34 47L24 68L9 5Z"/><path className="cursor-shine" d="M17 17L41 37L29 40L23 53L17 17Z"/></svg>
          </div>
        </motion.div>
      </section>

      <section className="feature-row feature-adapt gsap-section">
        <motion.div className="feature-art pale-green" whileHover={{ y: -8, scale: 1.01 }} transition={{ type: "spring", stiffness: 90, damping: 18 }}>
          <div className="practice-stack">
            {[0,1,2,3].map((card) => <div className={`practice-card pc-${card}`} key={card}><span>Multiply {(card + 1) * 2}(x + 2)</span><div><i/><i/><i/><i/><i/><i/></div></div>)}
            <KojiMascot className="koji-mini stack-koji" mood="celebrating" />
          </div>
        </motion.div>
        <div className="feature-copy gsap-reveal">
          <h3>Adapts to exactly<br/>where you are</h3>
          <p>Koji tracks what you’ve mastered and where you’re stuck, then builds practice around the gaps. He speeds up when you’re ready, and slows down when you need it.</p>
        </div>
      </section>

      <footer className="b-footer">
        <div className="b-footer-brand">
          <h2>Agathon</h2>
          <p>Interactive learning for math, science, and computer science — built around beautiful puzzles, guided discovery, and practice that feels like play.</p>
        </div>
        <div className="b-footer-links">
          <div><span>Product</span><p>Courses</p><p>Daily challenges</p><p>For educators</p><p>Gift Agathon</p></div>
          <div><span>Company</span><p>About us</p><p>Careers</p><p>Blog</p><p>Help center</p></div>
          <div><span>Explore</span><p>Math</p><p>Science</p><p>Computer science</p><p>Engineering</p></div>
        </div>
        <div className="b-footer-bottom"><span>© 2026 Agathon Learning</span><span>Terms · Privacy · Accessibility</span></div>
      </footer>
    </motion.main>
  );
}

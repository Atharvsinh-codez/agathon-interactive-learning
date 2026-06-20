"use client";

import { motion } from "framer-motion";

export default function ExplanationScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div className="explain-stage explain-redesign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className="explain-story-card" initial={{ y: 26, opacity: 0, scale: .985 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: .58, ease: [0.22, 1, 0.36, 1] }}>
        <div className="explain-progress-row" aria-label="Lesson progress">
          <button className="explain-close" aria-label="Close explanation">×</button>
          <div className="explain-progress-track"><span /></div>
          <div className="explain-xp">+20 XP</div>
        </div>
        <div className="explain-story-grid">
          <div className="explain-copy">
            <span className="story-kicker">Concept unlocked</span>
            <h1>Order turns small commands into behavior.</h1>
            <p>You exercised an important coding skill: using the right commands in the right order.</p>
            <p>That same idea powers <b>loops, logic, and variables</b> — tiny rules that create big behavior.</p>
            <div className="explain-code-card" aria-label="Pseudocode example">
              <div className="pseudo-line muted">while deliveries remain</div>
              <div className="pseudo-line indent">if street open ahead</div>
              <div className="pseudo-line indent2 active">drive forward</div>
            </div>
          </div>
          <motion.div className="explain-card" whileHover={{ y: -6, rotate: -.35 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <div className="explain-visual-top"><span>Route replay</span><b>3 steps</b></div>
            <div className="mini-grid"><span/><span/><span/><span/><span className="truck-dot"/><span/><span/><span className="gem-dot"/><span/></div>
            <svg className="explain-route" viewBox="0 0 240 120" aria-hidden="true">
              <path d="M38 86 C82 42, 118 44, 151 72 S202 79, 214 34" />
              <circle cx="38" cy="86" r="8" />
              <circle cx="214" cy="34" r="10" />
            </svg>
          </motion.div>
        </div>
        <div className="explain-takeaway">
          <div><b>Takeaway</b><span>Programs are stories for a computer: first this, then that.</span></div>
          <button onClick={onContinue}>Continue</button>
        </div>
      </motion.section>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import KojiMascot from "../KojiMascot";

export function WhyTutorSheet({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="why-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="why-card" initial={{ opacity: 0, y: 34, scale: .94, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: 28, scale: .96, filter: "blur(8px)" }} transition={{ duration: .48, ease: [0.22, 1, 0.36, 1] }}>
        <button className="why-close" onClick={onClose} aria-label="Close explanation">×</button>
        <div className="why-hero">
          <KojiMascot className="why-buddy" mood="pointing" pointingDirection="right" isTeaching />
          <svg className="why-svg" viewBox="0 0 260 150" aria-hidden="true">
            <path className="why-road" d="M28 112 C70 82, 82 48, 123 58 C165 68, 172 112, 224 38" />
            <circle className="why-node start" cx="28" cy="112" r="10" />
            <circle className="why-node mid" cx="123" cy="58" r="10" />
            <circle className="why-node goal" cx="224" cy="38" r="12" />
            <path className="why-arrow" d="M214 35 L226 38 L218 48" />
            <circle className="why-runner" r="7">
              <animateMotion dur="3.8s" repeatCount="indefinite" path="M28 112 C70 82, 82 48, 123 58 C165 68, 172 112, 224 38" />
            </circle>
          </svg>
        </div>
        <div className="why-copy">
          <span>Koji explains</span>
          <h2>Why this is correct</h2>
          <p>Your program first moves the truck forward, then uses the delivery command when the package reaches the target.</p>
        </div>
        <div className="why-steps">
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .16 }}><b>1</b><span>Drive to the package spot.</span></motion.div>
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25 }}><b>2</b><span>Deliver when the truck arrives.</span></motion.div>
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .34 }}><b>3</b><span>The route finishes with everything delivered.</span></motion.div>
        </div>
        <motion.button className="why-primary" whileTap={{ scale: .97 }} whileHover={{ scale: 1.01 }} onClick={onClose}>Got it</motion.button>
      </motion.div>
    </motion.div>
  );
}

export function LessonTutorSheet({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="lesson-tutor-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="lesson-tutor-card" initial={{ y: 90, opacity: 0, scale: .96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 70, opacity: 0, scale: .98 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}>
        <KojiMascot className="koji-fluid tutor-koji" mood="teaching" pointingDirection="right" isTeaching />
        <div className="tutor-copy">
          <p>You know how to move the truck around.</p>
          <p>Let’s add a new command: <b>delivering packages.</b></p>
          <p>Drive forward and deliver the package.</p>
        </div>
        <div className="tutor-input"><span>How can I help?</span><b>🎙</b></div>
        <button className="tutor-got" onClick={onClose}>Let’s try it</button>
      </motion.div>
    </motion.div>
  );
}

export function QuitConfirmSheet({ onKeepLearning, onQuit }: { onKeepLearning: () => void; onQuit: () => void }) {
  return (
    <motion.div className="quit-confirm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }} onClick={onKeepLearning}>
      <motion.div className="quit-confirm-sheet" role="dialog" aria-modal="true" aria-labelledby="quit-confirm-title" initial={{ y: 110, opacity: 0, scale: .96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 86, opacity: 0, scale: .98 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }} onClick={(event) => event.stopPropagation()}>
        <div className="quit-confirm-icon" aria-hidden="true">⚑</div>
        <h2 id="quit-confirm-title">Are you sure?</h2>
        <p>If you quit, you will lose your progress and XP.</p>
        <button className="quit-keep-btn" onClick={onKeepLearning}>Keep learning</button>
        <button className="quit-leave-btn" onClick={onQuit}>Quit</button>
      </motion.div>
    </motion.div>
  );
}

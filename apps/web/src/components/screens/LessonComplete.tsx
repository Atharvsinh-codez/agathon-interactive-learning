"use client";

import { motion } from "framer-motion";
import KojiMascot from "../KojiMascot";

export default function LessonComplete({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.div className="complete-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="complete-hero" initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
        <div className="complete-spotlight"/><KojiMascot className="green-mascot big" mood="celebrating" pointingDirection="up" /><div className="purple-platform big">✓</div>
      </motion.div>
      <h1>Lesson<br/>complete!</h1>
      <div className="stat-grid">
        <div className="stat-card"><b>110 ✦</b><span>TOTAL XP</span></div>
        <div className="stat-card"><b>2<span>/3</span></b><span>SCORE</span></div>
      </div>
      <div className="bottom-action"><button onClick={onRestart}>Continue</button></div>
    </motion.div>
  );
}

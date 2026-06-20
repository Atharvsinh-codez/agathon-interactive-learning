"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export type KojiMood = "idle" | "teaching" | "pointing" | "thinking" | "celebrating" | "waving";

export interface KojiMascotProps {
  mood?: KojiMood;
  pointingDirection?: "left" | "right" | "up" | "down";
  isTeaching?: boolean;
  className?: string;
}

const spring = { type: "spring", stiffness: 90, damping: 18, mass: 0.8 } as const;

const bodyFloat: Variants = {
  idle: {
    opacity: 1,
    y: [0, -8, 0],
    rotate: [-2, 2, -2],
    scaleX: [1, 0.985, 1.015, 1],
    scaleY: [1, 1.025, 0.985, 1],
    transition: { duration: 4.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  },
  teaching: {
    opacity: 1,
    y: [0, -11, 0],
    x: [0, 4, -3, 0],
    rotate: [-3, 4, -2, -3],
    scaleX: [1, 0.96, 1.04, 1],
    scaleY: [1, 1.06, 0.96, 1],
    transition: { duration: 3.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  },
  pointing: {
    opacity: 1,
    y: [0, -7, 0],
    rotate: [-1, 2, -1],
    transition: { duration: 3.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  },
  thinking: {
    opacity: 1,
    y: [0, -5, 0],
    rotate: [-4, -1, -4],
    transition: { duration: 4.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  },
  celebrating: {
    opacity: 1,
    y: [0, -16, 0],
    rotate: [-4, 5, -3, 0],
    scale: [1, 1.045, 0.99, 1],
    transition: { duration: 1.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  },
  waving: {
    opacity: 1,
    y: [0, -10, 0],
    rotate: [-2, 3, -2],
    transition: { duration: 2.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  },
};

export default function KojiMascot({ mood = "idle", pointingDirection: _pointingDirection = "right", isTeaching, className = "" }: KojiMascotProps) {
  const reduceMotion = useReducedMotion();
  void _pointingDirection;
  const [reaction, setReaction] = useState(false);
  const activeMood: KojiMood = reaction ? "waving" : isTeaching ? "teaching" : mood;
  const loopsOff = reduceMotion;

  return (
    <motion.div
      className={`koji-mascot ${className}`}
      data-mood={activeMood}
      variants={bodyFloat}
      initial={{ opacity: 0, y: loopsOff ? 0 : 10, scale: 0.96 }}
      animate={loopsOff ? { opacity: 1, y: 0, scale: 1 } : activeMood}
      whileHover={loopsOff ? undefined : { scale: 1.045, rotate: 1.5, transition: spring }}
      whileTap={loopsOff ? undefined : { scale: 0.96 }}
      onClick={() => {
        setReaction(true);
        window.setTimeout(() => setReaction(false), 1400);
      }}
      role="img"
      aria-label="Koji tutor mascot"
    >
      <motion.span
        className="koji-face"
        animate={loopsOff ? undefined : { x: activeMood === "thinking" ? [-1, 1, -1] : [0, 1.5, -1, 0] }}
        transition={loopsOff ? undefined : { duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <b className="koji-eye koji-eye-left" />
        <b className="koji-eye koji-eye-right" />
      </motion.span>
      <motion.em
        className="koji-shadow"
        animate={loopsOff ? undefined : { scale: [1, 0.86, 1], opacity: [0.22, 0.13, 0.22] }}
        transition={loopsOff ? undefined : { duration: 4.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      {!loopsOff && (activeMood === "celebrating" || reaction) && (
        <span className="koji-sparkles" aria-hidden="true">
          <motion.i initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.4], x: -24, y: -28 }} transition={{ duration: 0.9 }} />
          <motion.i initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.4], x: 24, y: -24 }} transition={{ duration: 0.9, delay: 0.08 }} />
          <motion.i initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.4], x: 8, y: -38 }} transition={{ duration: 0.9, delay: 0.16 }} />
        </span>
      )}
    </motion.div>
  );
}

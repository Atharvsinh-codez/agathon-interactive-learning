"use client";

import { motion } from "framer-motion";
import { Check, Equal, X } from "lucide-react";
import type { FractionProblem, FractionSet } from "../../lib/courses";

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

function simplify(num: number, den: number) {
  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

function FractionText({ num, den }: { num: number; den: number }) {
  return (
    <span className="rx-why-frac" aria-label={`${num} over ${den}`}>
      <span>{num}</span>
      <i />
      <span>{den}</span>
    </span>
  );
}

function shapeCopy(problem: FractionProblem) {
  switch (problem.shape) {
    case "two-uneven":
      return "This shape is split into unequal pieces, so we compare area, not just piece count.";
    case "halves-v":
      return "The shape is split into 2 equal halves. One half covers exactly half the whole.";
    case "thirds":
      return "The shape is split into 3 equal parts. Each part is one third of the whole.";
    case "quarters":
      return "The shape is split into 4 equal parts. Each part is one quarter of the whole.";
    case "sixths":
      return "The shape is split into 6 equal parts. Each part is one sixth of the whole.";
    case "eighths":
      return "The shape is split into 8 equal parts. Each part is one eighth of the whole.";
    default:
      return "Compare the colored area with the whole shape.";
  }
}

export default function FractionWhySheet({
  set,
  problem,
  selectedArea,
  totalArea,
  onClose,
}: {
  set: FractionSet;
  problem: FractionProblem;
  selectedArea: number;
  totalArea: number;
  onClose: () => void;
}) {
  const selected = simplify(Math.round(selectedArea), Math.round(totalArea));
  const target = simplify(problem.num, problem.den);
  const percent = Math.round((selectedArea / totalArea) * 100);

  return (
    <motion.div
      className="rx-why-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="rx-why-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fraction-why-title"
        initial={{ opacity: 0, y: 44, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="rx-why-close" type="button" aria-label="Close explanation" onClick={onClose}>
          <X strokeWidth={2.5} />
        </button>

        <div className="rx-why-mark">
          <Check strokeWidth={3} />
        </div>

        <div className="rx-why-copy">
          <span>{set.title}</span>
          <h2 id="fraction-why-title">Why this works</h2>
          <p>{shapeCopy(problem)}</p>
        </div>

        <div className="rx-why-equation" aria-label="Fraction explanation">
          <div>
            <b>Colored area</b>
            <FractionText num={selected.num} den={selected.den} />
          </div>
          <Equal aria-hidden="true" strokeWidth={2.4} />
          <div>
            <b>Target</b>
            <FractionText num={target.num} den={target.den} />
          </div>
        </div>

        <div className="rx-why-steps">
          <div>
            <b>1</b>
            <span>Start with the whole shape as 100 percent.</span>
          </div>
          <div>
            <b>2</b>
            <span>The colored part covers {percent} percent of that whole.</span>
          </div>
          <div>
            <b>3</b>
            <span>That matches the fraction in the question, so the answer is correct.</span>
          </div>
        </div>

        <button className="rx-why-done" type="button" onClick={onClose}>
          Got it
        </button>
      </motion.section>
    </motion.div>
  );
}

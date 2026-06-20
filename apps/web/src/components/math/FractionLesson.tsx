"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import KojiMascot from "../KojiMascot";
import FractionWhySheet from "./FractionWhySheet";
import { FRACTION_SETS, type FractionProblem, type FractionShape } from "../../lib/courses";

type Cell = { x: number; y: number; w: number; h: number };
type Result = "idle" | "wrong" | "correct";

const VB = 100;

/** Partition the unit square into clickable cells per shape. */
function cellsFor(shape: FractionShape): Cell[] {
  switch (shape) {
    case "two-uneven":
      return [
        { x: 0, y: 0, w: 100, h: 50 },
        { x: 0, y: 50, w: 50, h: 50 },
        { x: 50, y: 50, w: 50, h: 50 },
      ];
    case "halves-v":
      return [
        { x: 0, y: 0, w: 50, h: 100 },
        { x: 50, y: 0, w: 50, h: 100 },
      ];
    case "thirds":
      return [0, 1, 2].map((i) => ({ x: i * (100 / 3), y: 0, w: 100 / 3, h: 100 }));
    case "quarters":
      return [
        { x: 0, y: 0, w: 50, h: 50 }, { x: 50, y: 0, w: 50, h: 50 },
        { x: 0, y: 50, w: 50, h: 50 }, { x: 50, y: 50, w: 50, h: 50 },
      ];
    case "sixths":
      return [0, 1].flatMap((r) => [0, 1, 2].map((c) => ({ x: c * (100 / 3), y: r * 50, w: 100 / 3, h: 50 })));
    case "eighths":
      return [0, 1].flatMap((r) => [0, 1, 2, 3].map((c) => ({ x: c * 25, y: r * 50, w: 25, h: 50 })));
    default:
      return [];
  }
}

function Fraction({ num, den }: { num: number; den: number }) {
  return (
    <span className="rx-frac" aria-label={`${num} over ${den}`}>
      <span className="rx-frac-n">{num}</span>
      <span className="rx-frac-d">{den}</span>
    </span>
  );
}

function ShapeBoard({
  cells,
  selected,
  result,
  onToggle,
}: {
  cells: Cell[];
  selected: boolean[];
  result: Result;
  onToggle: (i: number) => void;
}) {
  return (
    <svg className="rx-shape" viewBox={`-1 -1 ${VB + 2} ${VB + 2}`} role="group" aria-label="Shape to color">
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          className={`rx-cell ${selected[i] ? "filled" : ""} ${result === "correct" ? "locked" : ""}`}
          onClick={() => onToggle(i)}
          role="button"
          aria-pressed={selected[i]}
        />
      ))}
    </svg>
  );
}

export default function FractionLesson({
  setIndex,
  onExit,
  onSolved,
}: {
  setIndex: number;
  onExit: () => void;
  onSolved: () => void;
}) {
  const set = FRACTION_SETS[setIndex] ?? FRACTION_SETS[0];
  const [step, setStep] = useState(0);
  const problem: FractionProblem = set.problems[step];

  const cells = useMemo(() => cellsFor(problem.shape), [problem.shape]);
  const areas = useMemo(() => cells.map((c) => c.w * c.h), [cells]);
  const total = useMemo(() => areas.reduce((a, b) => a + b, 0), [areas]);

  const [selected, setSelected] = useState<boolean[]>(() => cells.map(() => false));
  const [result, setResult] = useState<Result>("idle");
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    setSelected(cells.map(() => false));
    setResult("idle");
    setShowWhy(false);
  }, [cells]);

  const anySelected = selected.some(Boolean);
  const isLast = step === set.problems.length - 1;
  const progress = ((step + (result === "correct" ? 1 : 0)) / set.problems.length) * 100;
  const selectedArea = useMemo(
    () => areas.reduce((sum, area, i) => (selected[i] ? sum + area : sum), 0),
    [areas, selected],
  );

  function toggle(i: number) {
    if (result === "correct") return;
    setSelected((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
    setResult("idle");
    setShowWhy(false);
  }

  function check() {
    if (!anySelected) return;
    const target = (problem.num / problem.den) * total;
    if (Math.abs(selectedArea - target) < 0.5) {
      setResult("correct");
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.5 }, colors: ["#3B82F6", "#22C55E", "#FFFFFF"] });
    } else {
      setResult("wrong");
    }
  }

  function next() {
    if (isLast) {
      onSolved();
    } else {
      setStep((s) => s + 1);
    }
  }

  function startOver() {
    setSelected(cells.map(() => false));
    setResult("idle");
    setShowWhy(false);
  }

  const kojiCopy =
    result === "correct" ? "Nicely done." : result === "wrong" ? "Not quite — color equal parts." : `Welcome to ${set.title}.`;

  return (
    <div className={`rx-flesson ${result === "correct" ? "is-correct" : ""}`}>
      <header className="rx-flesson-top">
        <button className="rx-flesson-close" aria-label="Close lesson" onClick={onExit}>×</button>
        <div className="rx-flesson-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="rx-flesson-dots">
          {set.problems.map((_, i) => (
            <span key={i} className={i <= step ? "on" : ""} />
          ))}
        </div>
        <div className="rx-flesson-xp">{result === "correct" ? 15 : 0} ✦</div>
      </header>

      <div className="rx-flesson-stage">
        <h1>{problem.id ? set.title : set.title}</h1>
        <p className="rx-flesson-prompt">
          {problem.prompt ? (
            problem.prompt
          ) : (
            <>Color <Fraction num={problem.num} den={problem.den} /> of the shape.</>
          )}
        </p>

        <ShapeBoard cells={cells} selected={selected} result={result} onToggle={toggle} />

        <button className="rx-flesson-startover" onClick={startOver} type="button">
          ↺ Start over
        </button>
      </div>

      <div className="rx-flesson-koji">
        <KojiMascot mood={result === "correct" ? "celebrating" : "teaching"} isTeaching={result !== "correct"} />
        <AnimatePresence mode="wait">
          <motion.div
            key={kojiCopy}
            className={`rx-flesson-bubble ${result}`}
            initial={{ opacity: 0, y: 8, scale: .96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: .26 }}
          >
            {kojiCopy}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="rx-flesson-foot">
        <AnimatePresence mode="wait">
          {result === "correct" ? (
            <motion.div
              key="correct"
              className="rx-flesson-actions"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="rx-flesson-why" type="button" onClick={() => setShowWhy(true)}>Why?</button>
              <button className="rx-flesson-continue" type="button" onClick={next}>
                {isLast ? "Finish" : "Continue"}
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="check"
              className="rx-flesson-check"
              disabled={!anySelected}
              onClick={check}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}
            >
              Check
            </motion.button>
          )}
        </AnimatePresence>
      </footer>

      <AnimatePresence>
        {showWhy && (
          <FractionWhySheet
            set={set}
            problem={problem}
            selectedArea={selectedArea}
            totalArea={total}
            onClose={() => setShowWhy(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

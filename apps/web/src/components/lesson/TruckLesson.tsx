"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { createTurtle, stepTurtle } from "@blp/engine";
import KojiMascot from "../KojiMascot";
import { GemIcon, DeliveryMap } from "./DeliveryMap";
import { WhyTutorSheet, LessonTutorSheet, QuitConfirmSheet } from "./LessonSheets";
import {
  LEVELS,
  BLUE,
  GREEN,
  engineCommand,
  verbFor,
  verbForSlot,
  labelForSlot,
  type LessonCommand,
  type LessonResult,
} from "../../lib/lesson-config";

export default function TruckLesson({ onExit, onSolved, level }: { onExit: () => void; onSolved: () => void; level: number }) {
  const spec = LEVELS[level];
  const initialState = useMemo(() => createTurtle(spec.config), [spec]);
  const [slots, setSlots] = useState<LessonCommand[]>([]);
  const [result, setResult] = useState<LessonResult>("idle");
  const [shake, setShake] = useState(false);
  const [playbackState, setPlaybackState] = useState(initialState);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [showTutor, setShowTutor] = useState(level === 0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const isComplete = slots.length === spec.program.length;
  const expectedProgram: LessonCommand[] = level === 0 ? ["driveForward", "deliverPackage"] : spec.program;
  const isExactProgram = slots.length === expectedProgram.length && slots.every((cmd, index) => cmd === expectedProgram[index]);
  const displayState = playbackState;

  useEffect(() => {
    setSlots([]);
    setResult("idle");
    setPlaybackState(createTurtle(spec.config));
    setActiveStep(null);
    setShowTutor(level === 0);
    setShowQuitConfirm(false);
  }, [spec]);

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function pushSlot(command: LessonCommand) {
    if (result === "running" || result === "solved") return;
    if (slots.length >= spec.program.length) {
      setShake(true);
      setTimeout(() => setShake(false), 380);
      return;
    }
    setSlots((prev) => [...prev, command]);
    setResult("idle");
    setPlaybackState(initialState);
    setActiveStep(null);
  }
  function removeSlot(index: number) {
    if (result === "running" || result === "solved") return;
    setSlots((prev) => prev.filter((_, i) => i !== index));
    setResult("idle");
    setPlaybackState(initialState);
    setActiveStep(null);
  }
  function reset() {
    setSlots([]);
    setResult("idle");
    setPlaybackState(initialState);
    setActiveStep(null);
  }
  async function check() {
    if (slots.length === 0 || result === "running") {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setResult("running");
    setPlaybackState(initialState);
    setActiveStep(null);
    await sleep(180);

    let state = initialState;
    for (let i = 0; i < slots.length; i += 1) {
      setActiveStep(i);
      await sleep(230);
      state = stepTurtle(state, engineCommand(slots[i]));
      setPlaybackState(state);
      await sleep(430);
      if (state.status === "failed") break;
    }
    setActiveStep(null);

    if (state.status === "won" && isComplete && isExactProgram) {
      setResult("solved");
      confetti({ particleCount: level === 0 ? 90 : 150, spread: 78, origin: { y: 0.55 }, colors: [GREEN[500], BLUE[500], "#FFFFFF"] });
    } else {
      setResult("failed");
      setShake(true);
      setTimeout(() => setShake(false), 520);
    }
  }

  const blocks: { command: LessonCommand; label: string; verb?: string; arrow: string }[] = level === 0
    ? [
      { command: "driveForward", label: "forward", verb: "drive", arrow: "↑" },
      { command: "deliverPackage", label: "package", verb: "deliver", arrow: "▣" },
    ]
    : [
      { command: "turnLeft", label: "left", arrow: "↺" },
      { command: "turnRight", label: "right", arrow: "↻" },
      { command: "driveForward", label: "forward", arrow: "↑" },
    ];

  return (
    <motion.div className={`lesson-stage ${shake ? "shake" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="lesson-topbar">
        <button className="close-btn" aria-label="close" onClick={() => setShowQuitConfirm(true)}>×</button>
        <div className="lesson-dots" style={{ flex: 1, justifyContent: "center" }}>
          {Array.from({ length: 4 }).map((_, i) => <span key={i} className={i === 0 ? "active" : "idle"} />)}
        </div>
        <button className="hint-btn" aria-label="reset" onClick={reset} title="Reset">↺</button>
      </div>

      <div className="lesson-workspace-shell">
        <section className="lesson-brief-panel">
          <span className="lesson-kicker">Sequencing Commands</span>
          <div className="lesson-prompt">{LEVELS[level].prompt}</div>
          <div className="lesson-rule-card"><b>Goal</b><span>Build the exact route, then run it.</span></div>
          <div className="desktop-lesson-coach">
            <div className="coach-bubble">Let's add a new command:<br/>delivering packages.</div>
            <KojiMascot className="coach-koji" mood="thinking" />
            <div className="coach-actions"><button>💬</button><button>🎙</button></div>
          </div>
        </section>

        <section className="mission-card lesson-board-panel">
          {result === "solved" && (
            <div className="success-banner"><span className="env">✓</span> Deliveries complete!</div>
          )}
          <div className="mission-meta">
            <span className="mission-left"><GemIcon /> 1 left</span>
            <span className="mission-pill">Level <b>{level + 1}</b></span>
          </div>
          <DeliveryMap config={spec.config} program={spec.program} agent={displayState.agent} facing={displayState.facing} highlight={result === "running" || result === "solved" || result === "failed"} solved={result === "solved"} />
        </section>

        <aside className="lesson-command-panel">
          <div className="panel-label">Your program</div>
          <div className="slot-card">
            {Array.from({ length: spec.program.length }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`slot ${slots[i] ? "filled removable" : ""} ${activeStep === i ? "active-run" : ""}`}
                onClick={() => slots[i] && removeSlot(i)}
                aria-label={slots[i] ? `Remove command ${i + 1}` : `Empty command slot ${i + 1}`}
              >
                <span className="slot-num">{i + 1}</span>
                {slots[i] ? (
                  <div className="code-block in-slot">
                    <span className="kw">{verbForSlot(slots[i])}</span>
                    <span className="param">{labelForSlot(slots[i])}</span>
                    <span className="remove-x">×</span>
                  </div>
                ) : <span className="slot-empty">tap a block</span>}
              </button>
            ))}
          </div>

          <div className="panel-label command-label">Commands</div>
          <div className="block-card">
            {blocks.map((b) => (
              <button key={`${b.command}-${b.label}`} className="code-block selectable" disabled={result === "running" || result === "solved"} onClick={() => pushSlot(b.command)}>
                <span className="arrow">{b.arrow}</span>
                <span className="kw">{b.verb ?? verbFor(b.command)}</span>
                <span className="param">{b.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {result === "failed" && (
              <motion.div className="try-again-card" initial={{ opacity: 0, y: 10, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .98 }} transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}>
                <span>Not there yet</span>
                <p>The truck ran your program but didn’t reach the gem. Tap a block in your program to remove it, then try again.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="footer-bar">
            <button className="brilliant-mark" aria-label="brilliant">B</button>
            <button className="check-btn" disabled={!isComplete || result === "running" || result === "solved"} onClick={check}>{result === "running" ? "Running…" : "Check"}</button>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {result === "solved" && (
          <motion.div className="correct-sheet" initial={{ opacity: 0, x: "-50%", y: 120 }} animate={{ opacity: 1, x: "-50%", y: 0 }} exit={{ opacity: 0, x: "-50%", y: 80 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <div className="correct-left"><span>✓</span><div><b>Correct!</b><em>+{spec.xp} XP</em></div></div>
            <button className="why-btn" onClick={() => setShowWhy(true)}>Why?</button>
            <button className="continue-btn sheet-continue" onClick={onSolved}>Continue</button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{showWhy && <WhyTutorSheet onClose={() => setShowWhy(false)} />}</AnimatePresence>
      <AnimatePresence>{showTutor && <LessonTutorSheet onClose={() => setShowTutor(false)} />}</AnimatePresence>
      <AnimatePresence>{showQuitConfirm && <QuitConfirmSheet onKeepLearning={() => setShowQuitConfirm(false)} onQuit={onExit} />}</AnimatePresence>
    </motion.div>
  );
}

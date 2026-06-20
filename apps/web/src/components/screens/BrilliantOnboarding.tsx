"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Volume2, Info, GraduationCap, TrendingUp, Target, Rocket, Check } from "lucide-react";
import KojiMascot from "../KojiMascot";
import { Code2, Sigma } from "lucide-react";
import type { CourseId } from "../../lib/courses";

type Motivation = "school" | "growth" | "sharp" | "child";

const MOTIVATIONS: { id: Motivation; label: string; Icon: typeof Target; tint: string }[] = [
  { id: "school", label: "Excelling in school", Icon: GraduationCap, tint: "#34c759" },
  { id: "growth", label: "Professional growth", Icon: TrendingUp, tint: "#30b14a" },
  { id: "sharp", label: "Staying sharp", Icon: Target, tint: "#a25cf7" },
  { id: "child", label: "Helping my child learn", Icon: Rocket, tint: "#ff7a59" },
];

export default function BrilliantOnboarding({ onDone }: { onDone: (courseId: CourseId) => void }) {
  const [step, setStep] = useState(0);
  const [motivation, setMotivation] = useState<Motivation | null>(null);
  const [age, setAge] = useState("");
  const [subject, setSubject] = useState<CourseId | null>(null);

  const totalSteps = 3;
  const canContinue = step === 0 ? !!motivation : step === 1 ? age.trim().length > 0 : !!subject;

  function next() {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
      return;
    }
    onDone(subject ?? "code");
  }

  function back() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }

  return (
    <div className="rx-onb">
      <header className="rx-onb-top">
        <button className="rx-onb-back" aria-label="Back" onClick={back} disabled={step === 0}>
          <ChevronLeft strokeWidth={2.5} />
        </button>
        <div className="rx-onb-progress">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span key={i} className={i <= step ? "on" : ""}>
              <i style={{ width: i < step ? "100%" : i === step ? "55%" : "0%" }} />
            </span>
          ))}
        </div>
        <button className="rx-onb-sound" aria-label="Sound"><Volume2 strokeWidth={2.25} /></button>
      </header>

      <main className="rx-onb-shell">
        <AnimatePresence mode="wait">
          {/* ---------------- STEP 1: motivation ---------------- */}
          {step === 0 && (
            <motion.section
              key="motivation"
              className="rx-onb-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rx-onb-head">
                <KojiMascot className="rx-onb-koji" mood="teaching" isTeaching />
                <h1>What motivates you to learn?</h1>
              </div>

              <div className="rx-onb-grid">
                {MOTIVATIONS.map(({ id, label, Icon, tint }) => (
                  <motion.button
                    key={id}
                    type="button"
                    className={`rx-onb-card ${motivation === id ? "selected" : ""}`}
                    whileTap={{ scale: .97 }}
                    onClick={() => setMotivation(id)}
                    aria-pressed={motivation === id}
                  >
                    {motivation === id && <span className="rx-onb-tick"><Check strokeWidth={3} /></span>}
                    <span className="rx-onb-card-ic" style={{ color: tint }}><Icon strokeWidth={2} /></span>
                    <span className="rx-onb-card-label">{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}

          {/* ---------------- STEP 2: age ---------------- */}
          {step === 1 && (
            <motion.section
              key="age"
              className="rx-onb-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rx-onb-head">
                <KojiMascot className="rx-onb-koji" mood="thinking" />
                <h1>How old are you? <Info className="rx-onb-info" strokeWidth={2.25} /></h1>
              </div>

              <div className="rx-onb-age">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  placeholder="Your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                  autoFocus
                />
              </div>
            </motion.section>
          )}

          {/* ---------------- STEP 3: subject ---------------- */}
          {step === 2 && (
            <motion.section
              key="subject"
              className="rx-onb-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rx-onb-head">
                <KojiMascot className="rx-onb-koji" mood="teaching" isTeaching />
                <div>
                  <h1>What do you want to learn first?</h1>
                  <p>You can make progress in both subjects later on</p>
                </div>
              </div>

              <div className="rx-onb-subjects">
                <motion.button
                  type="button"
                  className={`rx-onb-subject code ${subject === "code" ? "selected" : ""}`}
                  whileTap={{ scale: .97 }}
                  onClick={() => setSubject("code")}
                  aria-pressed={subject === "code"}
                >
                  {subject === "code" && <span className="rx-onb-tick"><Check strokeWidth={3} /></span>}
                  <span className="rx-onb-subject-ic"><Code2 strokeWidth={1.8} /></span>
                  <span className="rx-onb-subject-label">Computer Science<br />& Coding</span>
                </motion.button>

                <motion.button
                  type="button"
                  className={`rx-onb-subject math ${subject === "math" ? "selected" : ""}`}
                  whileTap={{ scale: .97 }}
                  onClick={() => setSubject("math")}
                  aria-pressed={subject === "math"}
                >
                  {subject === "math" && <span className="rx-onb-tick"><Check strokeWidth={3} /></span>}
                  <span className="rx-onb-subject-ic"><Sigma strokeWidth={1.8} /></span>
                  <span className="rx-onb-subject-label">Math</span>
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="rx-onb-foot">
        <button className="rx-onb-continue" disabled={!canContinue} onClick={next}>
          {step === totalSteps - 1 ? "Start learning" : "Continue"}
        </button>
      </footer>
    </div>
  );
}

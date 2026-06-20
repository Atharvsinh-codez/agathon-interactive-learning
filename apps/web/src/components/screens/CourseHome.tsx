"use client";

import { motion } from "framer-motion";
import { Check, Play, Trophy, Target, Zap, ChevronRight, Layers, BookOpen } from "lucide-react";
import AppTopNav from "../nav/AppTopNav";
import { COURSE_ORDER, getCourse, type CourseId } from "../../lib/courses";

function CourseCard({
  id,
  selected,
  onSelect,
  onStart,
}: {
  id: CourseId;
  selected: boolean;
  onSelect: () => void;
  onStart: () => void;
}) {
  const course = getCourse(id);
  const Icon = course.accent === "green" ? Layers : BookOpen;
  return (
    <motion.div
      className={`rx-pick accent-${course.accent} ${selected ? "selected" : ""}`}
      onClick={onSelect}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      role="button"
      aria-pressed={selected}
    >
      <div className="rx-pick-top">
        <span className="rx-pick-ic"><Icon strokeWidth={2} /></span>
        {selected && (
          <motion.span layoutId="rx-pick-check" className="rx-pick-checked" transition={{ type: "spring", stiffness: 400, damping: 30 }}>
            <Check strokeWidth={3} />
          </motion.span>
        )}
      </div>

      {course.kicker && <span className="rx-pick-kicker">{course.kicker}</span>}
      <h2>{course.title}</h2>
      <p>{course.tagline}</p>

      <div className="rx-pick-meta">
        <span><b>{course.lessonCount}</b> Lessons</span>
        <span><b>{course.exerciseCount}</b> Exercises</span>
      </div>

      <div className="rx-pick-nodes">
        {course.nodes.slice(0, 3).map((n, i) => (
          <span key={n.id} className={`rx-pick-node ${i === 0 ? "on" : ""}`} title={n.title} />
        ))}
        <small>{course.nodes.length} lessons in Level 1</small>
      </div>

      <motion.button
        className="rx-pick-start"
        whileTap={{ scale: .98 }}
        onClick={(e) => { e.stopPropagation(); onSelect(); onStart(); }}
      >
        {selected ? "Continue" : "Start"} <ChevronRight strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}

export default function CourseHome({
  onContinue,
  courseId,
  onSelectCourse,
}: {
  onContinue: (id: CourseId) => void;
  courseId: CourseId;
  onSelectCourse: (id: CourseId) => void;
}) {
  return (
    <div className={`rx-home accent-${getCourse(courseId).accent}`}>
      <AppTopNav active="home" courseId={courseId} />

      <main className="rx-home-shell">
        {/* ---------------- SIDEBAR ---------------- */}
        <motion.aside className="rx-home-side" initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}>
          <div className="rx-search">
            <span className="rx-search-icon">⌕</span>
            <span>What do you want to learn?</span>
            <b className="rx-search-ask">Ask</b>
          </div>

          <div className="rx-streak">
            <div className="rx-streak-head">
              <div className="rx-streak-num"><strong>1</strong><Zap className="rx-streak-bolt" fill="currentColor" strokeWidth={0} /></div>
              <span className="rx-streak-label">day streak</span>
            </div>
            <div className="rx-streak-days">
              {["Su", "M", "T", "W", "Th"].map((d, i) => (
                <div key={d} className="rx-streak-day">
                  <span className={`rx-streak-orb ${i === 0 ? "hot" : ""}`}>
                    <Zap className="rx-streak-day-bolt" fill="currentColor" strokeWidth={0} />
                  </span>
                  <i className={i === 1 ? "today" : ""}>{d}</i>
                </div>
              ))}
            </div>
          </div>

          <div className="rx-goal">
            <span className="rx-goal-ic"><Target strokeWidth={2.25} /></span>
            <div className="rx-goal-body">
              <b>Daily goal</b>
              <div className="rx-goal-bar"><span style={{ width: "45%" }} /></div>
            </div>
            <em>15m</em>
          </div>

          <div className="rx-league">
            <span className="rx-league-ic"><Trophy strokeWidth={2.25} /></span>
            <div className="rx-league-body">
              <b>Unlock Leagues</b>
              <span>110 of 175 XP</span>
            </div>
          </div>
        </motion.aside>

        {/* ---------------- COURSE PICKER ---------------- */}
        <section className="rx-home-main">
          <motion.div className="rx-pick-head" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}>
            <h1>Choose your course</h1>
            <p>Pick a path to keep learning. You can switch anytime.</p>
          </motion.div>

          <motion.div
            className="rx-pick-grid"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: .08 } } }}
          >
            {COURSE_ORDER.map((id) => (
              <motion.div
                key={id}
                variants={{ hidden: { y: 22, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
              >
                <CourseCard
                  id={id}
                  selected={id === courseId}
                  onSelect={() => onSelectCourse(id)}
                  onStart={() => onContinue(id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

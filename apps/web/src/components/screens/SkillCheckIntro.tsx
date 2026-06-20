"use client";

import { motion } from "framer-motion";
import { Check, Lock, BookOpen, Layers } from "lucide-react";
import KojiMascot from "../KojiMascot";
import AppTopNav from "../nav/AppTopNav";
import { getCourse, type CourseId } from "../../lib/courses";

export default function SkillCheckIntro({
  onStart,
  courseId,
  currentIndex = 0,
}: {
  onStart: () => void;
  courseId: CourseId;
  currentIndex?: number;
}) {
  const course = getCourse(courseId);
  const activeIndex = Math.min(currentIndex, course.nodes.length - 1);
  const activeNode = course.nodes[activeIndex];
  const nodes = course.nodes.map((n, i) => ({
    ...n,
    state: i < activeIndex ? "done" : i === activeIndex ? "active" : "locked" as const,
  }));

  return (
    <div className={`rx-skill accent-${course.accent}`}>
      <AppTopNav active="path" courseId={courseId} />

      <main className="rx-skill-shell">
        {/* ---------- course card ---------- */}
        <motion.section
          className="rx-course-card"
          initial={{ x: -18, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={`rx-course-thumb accent-${course.accent}`}>
            {course.accent === "green" ? <Layers strokeWidth={2} /> : <BookOpen strokeWidth={2} />}
          </div>
          {course.kicker && <span className="rx-course-kicker">{course.kicker}</span>}
          <h1>{course.title}</h1>
          <p>{course.tagline}</p>
          <div className="rx-course-meta">
            <span><b>{course.lessonCount}</b> Lessons</span>
            <span><b>{course.exerciseCount}</b> Exercises</span>
          </div>
        </motion.section>

        {/* ---------- path ---------- */}
        <section className="rx-pathpanel">
          <motion.div className="rx-level-banner" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .45 }}>
            <span>Level 1</span>
            <b>{course.id === "code" ? "Taking the First Steps" : "Visualize Fractions"}</b>
          </motion.div>

          <div className="rx-path-label">{course.unit}</div>

          <div className="rx-trail">
            {nodes.map((n, i) => (
              <motion.div
                key={n.id}
                className={`rx-trail-step state-${n.state} ${i % 2 === 1 ? "right" : "left"}`}
                initial={{ scale: .6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: .15 + i * .12, type: "spring", stiffness: 240, damping: 18 }}
              >
                <span className="rx-trail-orb">
                  {n.state === "active" && <span className="rx-trail-pulse"><span /></span>}
                  {n.state === "active" && <KojiMascot className="rx-trail-koji" mood="teaching" isTeaching />}
                  {n.state === "locked" && <Lock strokeWidth={2.5} />}
                  {n.state === "done" && <Check strokeWidth={3} />}
                </span>
                <span className="rx-trail-text">
                  <b>{n.title}</b>
                  <small>{n.subtitle}</small>
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="rx-skill-start"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: .2, duration: .5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rx-start-copy">
              <span>Next mission</span>
              <h2>{activeNode.title}</h2>
            </div>
            <motion.button className="rx-start-btn" whileHover={{ y: -2 }} whileTap={{ y: 2, scale: .99 }} onClick={onStart}>
              Start
            </motion.button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

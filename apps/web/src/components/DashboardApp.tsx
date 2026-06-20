"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./screens/LandingPage";
import BrilliantOnboarding from "./screens/BrilliantOnboarding";
import CourseHome from "./screens/CourseHome";
import SettingsPage from "./screens/SettingsPage";
import SkillCheckIntro from "./screens/SkillCheckIntro";
import ExplanationScreen from "./screens/ExplanationScreen";
import LessonComplete from "./screens/LessonComplete";
import TruckLesson from "./lesson/TruckLesson";
import FractionLesson from "./math/FractionLesson";
import { LEVELS, type Stage } from "../lib/lesson-config";
import { getCourse, type CourseId } from "../lib/courses";
import { coursePath } from "../lib/routes";

export default function DashboardApp({
  initialStage = "landing",
  initialCourseId = "code",
}: {
  initialStage?: Stage;
  initialCourseId?: CourseId;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>(initialStage);
  const [level, setLevel] = useState(0);
  const [courseId, setCourseId] = useState<CourseId>(initialCourseId);

  useEffect(() => {
    setStage(initialStage);
    setCourseId(initialCourseId);
    setLevel(0);
  }, [initialCourseId, initialStage]);

  function selectCourse(id: CourseId) {
    setCourseId(id);
    setLevel(0);
  }

  function openCourse(id: CourseId) {
    selectCourse(id);
    router.push(coursePath(id));
  }

  function afterSolved() {
    if (courseId === "code" && level < LEVELS.length - 1) {
      setLevel((v) => v + 1);
      setStage("skill");
    } else {
      setStage("explain");
    }
  }

  function restart() {
    setLevel(0);
    setStage("skill");
  }

  const course = getCourse(courseId);
  const activeNode = course.nodes[Math.min(level, course.nodes.length - 1)];

  const screens: Record<Stage, ReactNode> = {
    landing: <LandingPage onStart={() => setStage("onboard")} />,
    onboard: (
      <BrilliantOnboarding
        onDone={(picked) => {
          selectCourse(picked);
          router.push("/dashboard");
        }}
      />
    ),
    course: <CourseHome courseId={courseId} onSelectCourse={selectCourse} onContinue={openCourse} />,
    settings: <SettingsPage />,
    skill: <SkillCheckIntro courseId={courseId} currentIndex={level} onStart={() => setStage("lesson")} />,
    lesson: activeNode.kind === "fraction"
      ? (
        <FractionLesson
          setIndex={activeNode.fractionIndex ?? 0}
          onExit={() => setStage("skill")}
          onSolved={afterSolved}
        />
      )
      : (
        <TruckLesson
          level={activeNode.levelIndex ?? level}
          onExit={() => setStage("skill")}
          onSolved={afterSolved}
        />
      ),
    explain: <ExplanationScreen onContinue={() => setStage("complete")} />,
    complete: <LessonComplete onRestart={restart} />,
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`${stage}-${courseId}-${level}`}
        initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -14, scale: 0.99, filter: "blur(6px)" }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ minHeight: "100dvh" }}
      >
        {screens[stage]}
      </motion.div>
    </AnimatePresence>
  );
}

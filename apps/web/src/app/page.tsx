"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "../components/screens/LandingPage";
import BrilliantOnboarding from "../components/screens/BrilliantOnboarding";
import CourseHome from "../components/screens/CourseHome";
import SettingsPage from "../components/screens/SettingsPage";
import SkillCheckIntro from "../components/screens/SkillCheckIntro";
import ExplanationScreen from "../components/screens/ExplanationScreen";
import LessonComplete from "../components/screens/LessonComplete";
import TruckLesson from "../components/lesson/TruckLesson";
import FractionLesson from "../components/math/FractionLesson";
import { LEVELS, type Stage } from "../lib/lesson-config";
import { getCourse, type CourseId } from "../lib/courses";

export default function Page() {
  const [stage, setStage] = useState<Stage>("landing");
  const [level, setLevel] = useState(0);
  const [courseId, setCourseId] = useState<CourseId>("code");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCourse = window.localStorage.getItem("blp:course");
      if (savedCourse === "code" || savedCourse === "math") setCourseId(savedCourse);
      const requestedStage = new URLSearchParams(window.location.search).get("stage") as Stage | null;
      const validStages: Stage[] = ["landing", "onboard", "course", "skill", "lesson", "explain", "complete", "settings"];
      if (requestedStage && validStages.includes(requestedStage)) {
        window.localStorage.setItem("blp:stage", requestedStage);
        setStage(requestedStage);
        return;
      }
      const saved = window.localStorage.getItem("blp:stage") as Stage | null;
      const savedLevel = Number(window.localStorage.getItem("blp:level") ?? "0");
      if (saved && validStages.includes(saved)) setStage(saved);
      if (Number.isInteger(savedLevel) && savedLevel >= 0 && savedLevel < LEVELS.length) setLevel(savedLevel);
    }
  }, []);

  useEffect(() => {
    const handleOnboardStart = (event: MouseEvent | PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest?.(".desktop-start")) return;
      window.localStorage.setItem("blp:stage", "course");
      setStage("course");
      window.setTimeout(() => window.location.reload(), 0);
    };
    window.addEventListener("click", handleOnboardStart, true);
    window.addEventListener("pointerup", handleOnboardStart, true);
    return () => {
      window.removeEventListener("click", handleOnboardStart, true);
      window.removeEventListener("pointerup", handleOnboardStart, true);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("blp:stage", stage);
      window.localStorage.setItem("blp:level", String(level));
      window.localStorage.setItem("blp:course", courseId);
    }
  }, [stage, level, courseId]);

  function selectCourse(id: CourseId) {
    setCourseId(id);
    setLevel(0);
  }

  function afterSolved() {
    if (courseId === "code" && level < LEVELS.length - 1) {
      setLevel((v) => v + 1);
      setStage("course");
    } else {
      setStage("explain");
    }
  }

  function restart() {
    setLevel(0);
    setStage("course");
  }

  const course = getCourse(courseId);
  const activeNode = course.nodes[Math.min(level, course.nodes.length - 1)];

  const screens: Record<Stage, ReactNode> = {
    landing: <LandingPage onStart={() => setStage("onboard")} />,
    onboard: <BrilliantOnboarding onDone={(picked) => { selectCourse(picked); setStage("course"); }} />,
    course: <CourseHome courseId={courseId} onSelectCourse={selectCourse} onContinue={() => setStage("skill")} />,
    settings: <SettingsPage />,
    skill: <SkillCheckIntro courseId={courseId} onStart={() => setStage("lesson")} />,
    lesson: activeNode.kind === "fraction"
      ? <FractionLesson setIndex={activeNode.fractionIndex ?? 0} onExit={() => setStage("course")} onSolved={afterSolved} />
      : <TruckLesson level={activeNode.levelIndex ?? level} onExit={() => setStage("course")} onSolved={afterSolved} />,
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

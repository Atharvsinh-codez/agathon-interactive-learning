import { LEVELS } from "./lesson-config";

/* =====================================================================
   COURSE MODEL
   Two courses, each a sequence of "nodes" (lessons) shown on the path.
   - Thinking in Code  → CS turtle lessons (3 levels)
   - Arithmetic Thinking → math fraction lessons
   The lesson stage renders TruckLesson or FractionLesson based on `kind`.
   ===================================================================== */

export type CourseId = "code" | "math";
export type LessonKind = "turtle" | "fraction";
export type NodeState = "done" | "active" | "locked";

export interface CourseNode {
  id: string;
  title: string;
  subtitle: string;
  kind: LessonKind;
  /** index into LEVELS for turtle lessons */
  levelIndex?: number;
  /** index into FRACTION_SETS for fraction lessons */
  fractionIndex?: number;
}

export interface CourseDef {
  id: CourseId;
  title: string;
  kicker?: string;
  tagline: string;
  unit: string;
  accent: "green" | "blue";
  lessonCount: number;
  exerciseCount: number;
  nodes: CourseNode[];
}

/* ---------- Fraction lesson specs (math course) ---------- */

export type FractionShape = "two-uneven" | "halves-v" | "quarters" | "thirds" | "sixths" | "eighths";

export interface FractionProblem {
  id: string;
  /** numerator / denominator the learner must color */
  num: number;
  den: number;
  /** how the shape is partitioned into clickable parts */
  shape: FractionShape;
  prompt?: string;
}

export interface FractionSet {
  id: string;
  title: string;
  subtitle: string;
  problems: FractionProblem[];
}

export const FRACTION_SETS: FractionSet[] = [
  {
    id: "finding-half",
    title: "Finding Half",
    subtitle: "Color one half of each shape",
    problems: [
      { id: "half-uneven", num: 1, den: 2, shape: "two-uneven" },
      { id: "half-vert", num: 1, den: 2, shape: "halves-v" },
      { id: "half-quarters", num: 2, den: 4, shape: "quarters", prompt: "Color 1/2 of the shape (that is 2 of the 4 equal parts)." },
    ],
  },
  {
    id: "unit-fractions",
    title: "Unit Fractions",
    subtitle: "Color one part of many",
    problems: [
      { id: "third", num: 1, den: 3, shape: "thirds" },
      { id: "quarter", num: 1, den: 4, shape: "quarters" },
      { id: "sixth", num: 1, den: 6, shape: "sixths" },
    ],
  },
  {
    id: "more-than-one-part",
    title: "More Than One Part",
    subtitle: "Color several equal parts",
    problems: [
      { id: "two-thirds", num: 2, den: 3, shape: "thirds" },
      { id: "three-quarters", num: 3, den: 4, shape: "quarters" },
      { id: "five-eighths", num: 5, den: 8, shape: "eighths" },
    ],
  },
];

/* ---------- Courses ---------- */

export const COURSES: Record<CourseId, CourseDef> = {
  code: {
    id: "code",
    title: "Thinking in Code",
    tagline: "Build solid foundations for computational problem solving.",
    unit: "Writing Programs",
    accent: "green",
    lessonCount: 48,
    exerciseCount: 588,
    nodes: LEVELS.map((lvl, i) => ({
      id: `code-${i}`,
      title: i === 0 ? "Warm Up" : lvl.title,
      subtitle: i === 0 ? "Sequencing Commands" : `Level ${i + 1}`,
      kind: "turtle",
      levelIndex: i,
    })),
  },
  math: {
    id: "math",
    title: "Maths",
    kicker: "Arithmetic",
    tagline: "Learn to wield important tools in number sense and computation.",
    unit: "Visualize Fractions",
    accent: "blue",
    lessonCount: 92,
    exerciseCount: 1205,
    nodes: FRACTION_SETS.map((set, i) => ({
      id: `math-${i}`,
      title: set.title,
      subtitle: set.subtitle,
      kind: "fraction",
      fractionIndex: i,
    })),
  },
};

export const COURSE_ORDER: CourseId[] = ["code", "math"];

export function getCourse(id: CourseId): CourseDef {
  return COURSES[id];
}

import { z } from "zod";

export const ProblemKindSchema = z.enum(["gridworld", "circuit", "graph", "mcq", "balance-equation", "area-model", "number-line", "pattern-rule"]);
export type ProblemKind = z.infer<typeof ProblemKindSchema>;

export const SubjectSchema = z.enum(["math", "science", "cs"]);
export type Subject = z.infer<typeof SubjectSchema>;

export const ReviewStateSchema = z.enum([
  "draft",
  "generated",
  "ai_validated",
  "design_review",
  "correctness_review",
  "in_review",
  "approved",
  "published",
  "rejected",
  "revision_requested",
]);
export type ReviewState = z.infer<typeof ReviewStateSchema>;

export const GridworldConfigSchema = z.object({
  schemaVersion: z.literal("gridworld.v1").default("gridworld.v1"),
  width: z.number().int().min(2).max(12),
  height: z.number().int().min(2).max(12),
  start: z.number().int().min(0),
  goal: z.number().int().min(0),
  walls: z.array(z.number().int().min(0)).default([]),
  maxSteps: z.number().int().min(1).max(64),
  objectiveId: z.string().min(1),
  prompt: z.string().min(1),
  solution: z.array(z.enum(["up", "down", "left", "right"])),
}).superRefine((config, ctx) => {
  const cells = config.width * config.height;
  for (const [key, value] of [["start", config.start], ["goal", config.goal]] as const) {
    if (value >= cells) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: `${key} outside grid` });
  }
  for (const wall of config.walls) {
    if (wall >= cells) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["walls"], message: `wall ${wall} outside grid` });
  }
  if (config.walls.includes(config.start)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["start"], message: "start cannot be wall" });
  if (config.walls.includes(config.goal)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["goal"], message: "goal cannot be wall" });
});
export type GridworldProblemConfig = z.infer<typeof GridworldConfigSchema>;

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  objective: z.string(),
  problem: GridworldConfigSchema,
  reviewState: ReviewStateSchema,
});
export type Lesson = z.infer<typeof LessonSchema>;

export const sampleLesson: Lesson = {
  id: "lesson-gridworld-sequencing",
  title: "Make the robot reason in steps",
  objective: "Learners build intuition that programs are ordered actions, and one blocked action changes the whole path.",
  reviewState: "approved",
  problem: {
    schemaVersion: "gridworld.v1",
    width: 5,
    height: 5,
    start: 0,
    goal: 24,
    walls: [5, 6, 11, 13, 16, 21],
    maxSteps: 8,
    objectiveId: "sequencing-001",
    prompt: "Move the toy bot to the glowing goal using the shortest reliable sequence.",
    solution: ["right", "right", "down", "down", "down", "right", "right", "down"],
  },
};

export const LessonObjectiveSchema = z.object({
  id: z.string().min(1),
  subject: SubjectSchema,
  domain: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  learnerGoal: z.string().min(1),
  misconceptionToAvoid: z.string().min(1),
  masteryCriteria: z.array(z.string().min(1)).min(1),
});
export type LessonObjective = z.infer<typeof LessonObjectiveSchema>;

export const MathStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  operation: z.string().min(1),
  explanation: z.string().min(1),
});
export type MathStep = z.infer<typeof MathStepSchema>;

export const BalanceEquationPuzzleSchema = z.object({
  schemaVersion: z.literal("math.balance-equation.v1").default("math.balance-equation.v1"),
  kind: z.literal("balance-equation"),
  equation: z.string().min(1),
  variable: z.string().min(1),
  initialLeft: z.string().min(1),
  initialRight: z.string().min(1),
  targetValue: z.number(),
  availableSteps: z.array(MathStepSchema).min(1),
  solutionStepIds: z.array(z.string().min(1)).min(1),
  kojiIntro: z.string().min(1),
  successExplanation: z.string().min(1),
});
export type BalanceEquationPuzzle = z.infer<typeof BalanceEquationPuzzleSchema>;

export const LessonVariantSchema = z.object({
  id: z.string().min(1),
  parentLessonId: z.string().min(1),
  title: z.string().min(1),
  prompt: z.string().min(1),
  puzzle: BalanceEquationPuzzleSchema,
  status: ReviewStateSchema,
  reviewNotes: z.array(z.string()).default([]),
  generatedBy: z.enum(["human", "deterministic-generator", "ai-draft"]).default("deterministic-generator"),
});
export type LessonVariant = z.infer<typeof LessonVariantSchema>;

export const LessonSetSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  objective: LessonObjectiveSchema,
  prompt: z.string().min(1),
  puzzle: BalanceEquationPuzzleSchema,
  variants: z.array(LessonVariantSchema),
  status: ReviewStateSchema,
  updatedAt: z.string().min(1),
});
export type LessonSet = z.infer<typeof LessonSetSchema>;

export const algebraBalanceLessonSet: LessonSet = {
  id: "math-algebra-balance-001",
  title: "Algebra Foundations: Keep the Scale Balanced",
  status: "approved",
  updatedAt: "2026-06-14T00:00:00.000Z",
  objective: {
    id: "objective-balance-equations-001",
    subject: "math",
    domain: "Algebra Foundations",
    title: "Solve one-step equations by keeping both sides balanced",
    description: "Learners understand that solving an equation means applying the same operation to both sides so equality is preserved.",
    learnerGoal: "Undo the operation around x and reveal the value that keeps the equation true.",
    misconceptionToAvoid: "Only changing one side of an equation breaks equality, even if the arithmetic looks helpful.",
    masteryCriteria: [
      "Learner chooses the inverse operation needed to isolate x.",
      "Learner applies the operation to both sides of the equation.",
      "Learner can explain why the final value satisfies the original equation.",
    ],
  },
  prompt: "Solve x + 3 = 7. Choose the move that keeps the equation balanced.",
  puzzle: {
    schemaVersion: "math.balance-equation.v1",
    kind: "balance-equation",
    equation: "x + 3 = 7",
    variable: "x",
    initialLeft: "x + 3",
    initialRight: "7",
    targetValue: 4,
    kojiIntro: "Whatever you do to one side, do to the other. Try undoing +3 first.",
    successExplanation: "Subtracting 3 from both sides keeps the scale balanced and leaves x = 4.",
    availableSteps: [
      { id: "subtract-3-both-sides", label: "subtract 3 from both sides", operation: "-3 both sides", explanation: "This undoes +3 while preserving equality." },
      { id: "subtract-3-left-only", label: "subtract 3 from the left only", operation: "-3 left only", explanation: "This changes only one side, so it breaks equality." },
      { id: "add-3-both-sides", label: "add 3 to both sides", operation: "+3 both sides", explanation: "This keeps equality but moves farther from isolating x." },
      { id: "state-x-equals-4", label: "state x = 4", operation: "x = 4", explanation: "After subtracting 3 from both sides, the value is x = 4." },
    ],
    solutionStepIds: ["subtract-3-both-sides", "state-x-equals-4"],
  },
  variants: [],
};

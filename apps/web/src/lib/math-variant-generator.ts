import type { BalanceEquationPuzzle, LessonSet, LessonVariant } from "@blp/schema";

const variantSpecs = [
  { id: "x-plus-4-equals-9", addend: 4, result: 9, answer: 5, status: "generated" as const },
  { id: "x-plus-6-equals-11", addend: 6, result: 11, answer: 5, status: "in_review" as const },
  { id: "x-minus-2-equals-5", addend: -2, result: 5, answer: 7, status: "generated" as const },
  { id: "x-plus-5-equals-8", addend: 5, result: 8, answer: 3, status: "rejected" as const },
];

function operationCopy(addend: number) {
  if (addend >= 0) {
    return {
      equation: `x + ${addend}`,
      undoLabel: `subtract ${addend} from both sides`,
      undoOperation: `-${addend} both sides`,
      wrongLabel: `add ${addend} to both sides`,
      wrongOperation: `+${addend} both sides`,
      misconception: `Adding ${addend} keeps equality but moves farther from isolating x.`,
      success: `Subtracting ${addend} from both sides keeps the scale balanced and leaves x alone.`,
    };
  }

  const amount = Math.abs(addend);
  return {
    equation: `x - ${amount}`,
    undoLabel: `add ${amount} to both sides`,
    undoOperation: `+${amount} both sides`,
    wrongLabel: `subtract ${amount} from both sides`,
    wrongOperation: `-${amount} both sides`,
    misconception: `Subtracting ${amount} keeps equality but moves farther from isolating x.`,
    success: `Adding ${amount} to both sides keeps the scale balanced and leaves x alone.`,
  };
}

export function createBalanceEquationPuzzle(spec: (typeof variantSpecs)[number]): BalanceEquationPuzzle {
  const copy = operationCopy(spec.addend);
  const undoId = `${spec.id}-undo`;
  const stateId = `${spec.id}-state-answer`;

  return {
    schemaVersion: "math.balance-equation.v1",
    kind: "balance-equation",
    equation: `${copy.equation} = ${spec.result}`,
    variable: "x",
    initialLeft: copy.equation,
    initialRight: String(spec.result),
    targetValue: spec.answer,
    kojiIntro: "Keep the equation balanced: do the same operation to both sides.",
    successExplanation: `${copy.success} The value is x = ${spec.answer}.`,
    availableSteps: [
      { id: undoId, label: copy.undoLabel, operation: copy.undoOperation, explanation: "This is the inverse operation, applied to both sides." },
      { id: `${spec.id}-left-only`, label: copy.undoLabel.replace("both sides", "left side only"), operation: `${copy.undoOperation} left only`, explanation: "This breaks equality because only one side changes." },
      { id: `${spec.id}-wrong-direction`, label: copy.wrongLabel, operation: copy.wrongOperation, explanation: copy.misconception },
      { id: stateId, label: `state x = ${spec.answer}`, operation: `x = ${spec.answer}`, explanation: "This names the isolated variable value." },
    ],
    solutionStepIds: [undoId, stateId],
  };
}

export function generateMathLessonVariants(lessonSet: LessonSet): LessonVariant[] {
  return variantSpecs.map((spec, index) => ({
    id: `variant-${spec.id}`,
    parentLessonId: lessonSet.id,
    title: `Practice ${index + 1}: ${createBalanceEquationPuzzle(spec).equation}`,
    prompt: `Solve ${createBalanceEquationPuzzle(spec).equation}. Choose the move that keeps both sides balanced.`,
    puzzle: createBalanceEquationPuzzle(spec),
    status: spec.status,
    generatedBy: "deterministic-generator",
    reviewNotes: spec.status === "rejected"
      ? ["Rejected demo item: copy needs review before learners see it."]
      : spec.status === "in_review"
        ? ["Needs human correctness/design review before approval."]
        : [],
  }));
}

export function getMathLessonSetWithVariants(lessonSet: LessonSet): LessonSet {
  return {
    ...lessonSet,
    variants: generateMathLessonVariants(lessonSet),
    updatedAt: new Date().toISOString(),
  };
}

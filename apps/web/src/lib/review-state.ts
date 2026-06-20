import type { ReviewState } from "@blp/schema";

const allowedTransitions: Record<ReviewState, ReviewState[]> = {
  draft: ["generated", "design_review"],
  generated: ["in_review", "revision_requested", "rejected"],
  ai_validated: ["design_review", "correctness_review", "rejected"],
  design_review: ["correctness_review", "revision_requested", "rejected"],
  correctness_review: ["approved", "revision_requested", "rejected"],
  in_review: ["approved", "rejected", "revision_requested"],
  approved: ["published", "revision_requested"],
  published: ["revision_requested"],
  rejected: ["generated", "revision_requested"],
  revision_requested: ["generated", "design_review"],
};

export function canTransitionReviewState(from: ReviewState, to: ReviewState) {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function transitionReviewState(from: ReviewState, to: ReviewState): ReviewState {
  if (!canTransitionReviewState(from, to)) {
    throw new Error(`Invalid review transition: ${from} -> ${to}`);
  }
  return to;
}

export const humanReviewChecklist = [
  "Learning objective is preserved.",
  "Solution steps are mathematically correct.",
  "No generated step reinforces a misconception.",
  "Difficulty matches the current practice set.",
  "Learner-facing copy is clear and confidence-building.",
];

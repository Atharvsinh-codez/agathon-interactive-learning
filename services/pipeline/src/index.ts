import { validateGridworld, type Direction } from "@blp/engine";
import { sampleLesson } from "@blp/schema";

type PipelineCandidate = {
  id: string;
  config: typeof sampleLesson.problem;
  reviewState: "draft" | "ai_validated" | "design_review" | "correctness_review" | "approved";
  validation: ReturnType<typeof validateGridworld> | null;
};

const candidatePrograms: Direction[][] = [
  ["right", "right", "down", "down", "down", "right", "right", "down"],
  ["down", "down", "right", "right", "right", "right", "down", "down"],
];

export function generateGridworldVariants(count = 3): PipelineCandidate[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `variant-${index + 1}`,
    config: {
      ...sampleLesson.problem,
      walls: index === 0 ? [5, 6, 11, 13, 16, 21] : index === 1 ? [3, 4, 5, 8, 13, 16] : [5, 6, 10, 11, 13, 21],
      prompt: `Variant ${index + 1}: guide the animated toy bot while preserving sequencing objective.`,
    },
    reviewState: "draft",
    validation: null,
  }));
}

export function runVariantPipeline() {
  return generateGridworldVariants().map((candidate) => {
    const engineConfig = {
      width: candidate.config.width,
      height: candidate.config.height,
      start: candidate.config.start,
      goal: candidate.config.goal,
      walls: candidate.config.walls,
      maxSteps: candidate.config.maxSteps,
    };
    const validation = validateGridworld(engineConfig, [candidate.config.solution, candidatePrograms[1]]);
    return {
      ...candidate,
      validation,
      reviewState: validation.ok ? "approved" as const : "draft" as const,
    };
  });
}

if (process.argv[1]?.endsWith("index.ts")) {
  console.log(JSON.stringify(runVariantPipeline(), null, 2));
}

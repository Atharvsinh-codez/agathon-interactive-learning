import { NextResponse } from "next/server";
import { validateGridworld, type GridworldConfig } from "@blp/engine";
import { algebraBalanceLessonSet, sampleLesson } from "@blp/schema";
import { generateMathLessonVariants } from "../../../lib/math-variant-generator";
import { humanReviewChecklist } from "../../../lib/review-state";

export function GET() {
  const gridworldVariants = [
    { ...sampleLesson.problem, prompt: "Variant A: shortest reliable route", walls: [5, 6, 11, 13, 16, 21] },
    { ...sampleLesson.problem, prompt: "Variant B: avoid the middle block", walls: [4, 5, 10, 11, 16, 17] },
    { ...sampleLesson.problem, prompt: "Variant C: late turn sequencing", walls: [3, 8, 9, 14, 19] },
  ].map((config, index) => {
    const gridConfig = { ...sampleLesson.problem, ...config } as GridworldConfig & { solution: typeof sampleLesson.problem.solution };
    return {
      id: `grid-variant-${index + 1}`,
      config: gridConfig,
      validation: validateGridworld(gridConfig, [gridConfig.solution]),
      reviewState: "approved",
    };
  });

  const mathVariants = generateMathLessonVariants(algebraBalanceLessonSet);

  return NextResponse.json({
    subject: "math",
    objective: algebraBalanceLessonSet.objective,
    parentLessonId: algebraBalanceLessonSet.id,
    variants: mathVariants,
    reviewChecklist: humanReviewChecklist,
    legacyGridworldVariants: gridworldVariants,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const sourceLesson = body?.lessonSet ?? algebraBalanceLessonSet;
  const variants = generateMathLessonVariants(sourceLesson);

  return NextResponse.json({
    subject: "math",
    parentLessonId: sourceLesson.id,
    variants,
    note: "Deterministic demo generator: preserves the learning objective and awaits human review before publishing.",
  });
}

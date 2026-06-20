import { NextResponse } from "next/server";
import { algebraBalanceLessonSet, sampleLesson } from "@blp/schema";
import { getMathLessonSetWithVariants } from "../../../lib/math-variant-generator";
import { humanReviewChecklist } from "../../../lib/review-state";

export function GET() {
  const mathLessonSet = getMathLessonSetWithVariants(algebraBalanceLessonSet);

  return NextResponse.json({
    course: "Math Lesson Playground",
    prototype: {
      course: "Computational Thinking",
      lesson: sampleLesson,
    },
    playground: {
      primarySubject: "math",
      lessonSets: [mathLessonSet],
      reviewChecklist: humanReviewChecklist,
      pipeline: [
        "Human creative direction",
        "AI/deterministic implementation draft",
        "Generated variants",
        "Design review",
        "Correctness review",
        "Approved learner practice",
      ],
    },
    edgeCached: true,
  });
}

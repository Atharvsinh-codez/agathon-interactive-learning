export { PrismaClient } from "@prisma/client";

export const reviewFlow = {
  draft: ["ai_validated", "rejected"],
  ai_validated: ["design_review", "revision_requested"],
  design_review: ["correctness_review", "revision_requested"],
  correctness_review: ["approved", "revision_requested", "rejected"],
  approved: ["published", "revision_requested"],
  published: [],
  rejected: ["draft"],
  revision_requested: ["draft"],
} as const;

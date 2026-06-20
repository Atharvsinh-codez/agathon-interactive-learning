import DashboardApp from "../../../../components/DashboardApp";
import type { CourseId } from "../../../../lib/courses";

function courseFromSlug(slug: string): CourseId {
  return slug.toLowerCase() === "math" ? "math" : "code";
}

export default async function CourseDashboardPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  return <DashboardApp initialStage="skill" initialCourseId={courseFromSlug(courseSlug)} />;
}

import type { CourseId } from "./courses";

export function coursePath(id: CourseId) {
  return id === "math" ? "/dashboard/course/math" : "/dashboard/course/Thinking-in-code";
}

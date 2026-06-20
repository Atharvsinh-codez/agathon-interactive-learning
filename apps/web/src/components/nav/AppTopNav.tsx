"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Home, Route, LayoutGrid, Settings } from "lucide-react";
import { coursePath } from "../../lib/routes";
import type { CourseId } from "../../lib/courses";

type NavKey = "home" | "path" | "courses" | "settings";

const ITEMS: { key: NavKey; label: string; Icon: typeof Home }[] = [
  { key: "home", label: "Home", Icon: Home },
  { key: "path", label: "Path", Icon: Route },
  { key: "courses", label: "Courses", Icon: LayoutGrid },
];

export default function AppTopNav({
  active = "home",
  courseId = "code",
}: {
  active?: NavKey;
  courseId?: CourseId;
}) {
  const router = useRouter();

  function hrefFor(key: NavKey) {
    if (key === "path") return coursePath(courseId);
    if (key === "settings") return "/dashboard/settings";
    return "/dashboard";
  }

  return (
    <div className="rx-nav-wrap">
      <nav className="rx-nav" aria-label="Primary">
        <button type="button" className="rx-nav-logo" onClick={() => router.push("/dashboard")}>
          <img src="/agathon-mark.png" alt="" className="rx-nav-logo-mark" />
          Agathon
        </button>

        <div className="rx-nav-items">
          {ITEMS.map(({ key, label, Icon }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                className={`rx-nav-item ${isActive ? "is-active" : ""}`}
                onClick={() => router.push(hrefFor(key))}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="rx-nav-active"
                    className="rx-nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="rx-nav-icon" strokeWidth={2.25} aria-hidden="true" />
                <span className="rx-nav-label">{label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`rx-nav-settings ${active === "settings" ? "is-active" : ""}`}
          aria-label="Settings"
          onClick={() => router.push("/dashboard/settings")}
        >
          <Settings className="rx-nav-icon" strokeWidth={2.25} aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

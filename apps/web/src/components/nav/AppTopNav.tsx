"use client";

import { motion } from "framer-motion";
import { Home, Route, LayoutGrid, Settings } from "lucide-react";
import { goToStage, type Stage } from "../../lib/lesson-config";

type NavKey = "home" | "path" | "courses" | "settings";

const ITEMS: { key: NavKey; label: string; stage: Stage; Icon: typeof Home }[] = [
  { key: "home", label: "Home", stage: "course", Icon: Home },
  { key: "path", label: "Path", stage: "skill", Icon: Route },
  { key: "courses", label: "Courses", stage: "skill", Icon: LayoutGrid },
];

export default function AppTopNav({ active = "home" }: { active?: NavKey }) {
  return (
    <div className="rx-nav-wrap">
      <nav className="rx-nav" aria-label="Primary">
        <button type="button" className="rx-nav-logo" onClick={() => goToStage("course")}>
          <img src="/agathon-mark.png" alt="" className="rx-nav-logo-mark" />
          Agathon
        </button>

        <div className="rx-nav-items">
          {ITEMS.map(({ key, label, stage, Icon }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                className={`rx-nav-item ${isActive ? "is-active" : ""}`}
                onClick={() => goToStage(stage)}
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
          onClick={() => goToStage("settings")}
        >
          <Settings className="rx-nav-icon" strokeWidth={2.25} aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

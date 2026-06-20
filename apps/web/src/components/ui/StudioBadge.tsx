import type { HTMLAttributes, PropsWithChildren } from "react";
import { cx } from "./cx";

type BadgeTone = "neutral" | "generated" | "review" | "approved" | "rejected";

type StudioBadgeProps = PropsWithChildren<HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
}>;

export function StudioBadge({ tone = "neutral", className, children, ...props }: StudioBadgeProps) {
  return (
    <span className={cx("studio-badge", `studio-badge-${tone}`, className)} {...props}>
      {children}
    </span>
  );
}

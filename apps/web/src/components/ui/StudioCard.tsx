import type { HTMLAttributes, PropsWithChildren } from "react";
import { cx } from "./cx";

type CardTone = "plain" | "elevated" | "glass" | "dark" | "glow";

type StudioCardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
}>;

export function StudioCard({ tone = "plain", className, children, ...props }: StudioCardProps) {
  return (
    <div className={cx("studio-card", `studio-card-${tone}`, className)} {...props}>
      {children}
    </div>
  );
}

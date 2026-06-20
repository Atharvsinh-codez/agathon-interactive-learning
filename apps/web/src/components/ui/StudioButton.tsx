import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cx } from "./cx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger";

type StudioButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}>;

export function StudioButton({ variant = "primary", className, children, ...props }: StudioButtonProps) {
  return (
    <button className={cx("studio-button", `studio-button-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}

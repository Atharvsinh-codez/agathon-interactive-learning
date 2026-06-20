import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function LumioLogo({ className = "" }: { className?: string }) {
  return <span className={cn("lumio-logo", className)}>Agathon<span>Lab</span></span>;
}

export function BeamButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("beam-button", className)} {...props}><span className="beam beam-a"/><span className="beam beam-b"/><span className="beam-content">{children}</span></button>;
}

export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass-card", className)}><span className="beam beam-a"/><span className="beam beam-b"/>{children}</div>;
}

export function AnimatedToy() {
  return (
    <svg className="toy-svg" viewBox="0 0 420 320" role="img" aria-label="Animated software toy explaining a gridworld lesson">
      <defs>
        <linearGradient id="toyBlue" x1="0" x2="1"><stop offset="0" stopColor="#3372d9"/><stop offset="1" stopColor="#8669b9"/></linearGradient>
        <filter id="toyGlow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x="46" y="38" width="328" height="230" rx="34" fill="rgba(255,255,255,.09)" stroke="rgba(255,255,255,.22)"/>
      {[0,1,2,3,4].map((r) => [0,1,2,3,4].map((c) => <rect key={`${r}-${c}`} className="toy-cell" x={88+c*42} y={72+r*32} width="30" height="24" rx="7" fill={r===4&&c===4?"#fefefe":(r+c)%3===0?"rgba(51,114,217,.42)":"rgba(255,255,255,.12)"} />))}
      <path className="toy-path" d="M103 84 H187 V148 H271 V212 H292" fill="none" stroke="#fefefe" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10"/>
      <g className="toy-bot" filter="url(#toyGlow)">
        <rect x="126" y="134" width="76" height="58" rx="22" fill="url(#toyBlue)"/>
        <circle cx="151" cy="160" r="6" fill="#fefefe"/><circle cx="177" cy="160" r="6" fill="#fefefe"/>
        <path d="M150 178 Q164 187 178 178" stroke="#fefefe" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M164 134 V118" stroke="#fefefe" strokeWidth="4" strokeLinecap="round"/><circle cx="164" cy="112" r="7" fill="#fefefe"/>
      </g>
      <g className="toy-bubble"><rect x="215" y="103" width="118" height="56" rx="18" fill="#fefefe"/><text x="274" y="127" textAnchor="middle" fill="#0e0a07" fontSize="12" fontWeight="700">Try a step.</text><text x="274" y="144" textAnchor="middle" fill="rgba(14,10,7,.55)" fontSize="10">Then debug it.</text></g>
    </svg>
  );
}

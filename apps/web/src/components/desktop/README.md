# Desktop Product Sections

This folder documents the separated desktop product surfaces used by the Brilliant-style prototype.

Current implemented sections in `src/app/page.tsx`:
- `AppTopNav` / `PremiumBanner` — desktop shell
- `CourseHome` — desktop home/course dashboard
- `SkillCheckIntro` — course detail + lesson path
- `TruckLesson` — desktop lesson puzzle + coach

The visual system is applied from the final desktop polish layer in `src/app/styles.css`.
These section names are intentionally stable so future extraction can move JSX into dedicated files without changing behavior.

Design direction:
- Apple/iOS style white canvas
- soft glass panels
- rounded premium cards
- subtle shadows and micro-interactions
- no overlapping puzzle command blocks
- clean Brilliant-like learning visuals only

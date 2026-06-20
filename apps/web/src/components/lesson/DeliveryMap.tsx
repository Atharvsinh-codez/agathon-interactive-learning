"use client";

import { useMemo } from "react";
import { createTurtle, stepTurtle, type Cardinal, type TurtleCommand, type TurtleConfig } from "@blp/engine";
import { BLUE, GREEN, GREY, PAD, CELL, VB_W, VB_H, idxToXY, angleFor } from "../../lib/lesson-config";

export function GemIcon() {
  return (
    <span className="mission-gem">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2L22 9L12 22L2 9L12 2Z" fill="#3079FF" />
        <path d="M12 2L22 9H2L12 2Z" fill="#7EB1FF" />
        <path d="M12 22L22 9H2L12 22Z" fill="#0051E6" />
      </svg>
    </span>
  );
}

export function DeliveryMap({
  config,
  program,
  agent,
  facing,
  highlight,
  solved,
}: {
  config: TurtleConfig;
  program: TurtleCommand[];
  agent: number;
  facing: Cardinal;
  highlight?: boolean;
  solved?: boolean;
}) {
  const path = useMemo(() => {
    const cells: Array<{ x: number; y: number }> = [idxToXY(config.start)];
    let s = createTurtle(config);
    for (const cmd of program) {
      s = stepTurtle(s, cmd);
      cells.push(idxToXY(s.agent));
      if (s.status === "won") break;
    }
    return cells;
  }, [config, program]);

  const agentXY = idxToXY(agent);
  const goalXY = idxToXY(config.goal);
  const walls = config.walls;

  return (
    <div className="map-wrap">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="map-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="gridDots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={BLUE[200]} />
          </pattern>
        </defs>
        <rect width={VB_W} height={VB_H} fill={BLUE[50]} />
        <rect width={VB_W} height={VB_H} fill="url(#gridDots)" />

        {path.map((p, i) => (
          <rect
            key={`road-${i}`}
            x={PAD + p.x * CELL + 2}
            y={PAD + p.y * CELL + 2}
            width={CELL - 4}
            height={CELL - 4}
            rx="8"
            fill={GREY[200]}
          />
        ))}

        {walls.map((w) => {
          const { x, y } = idxToXY(w);
          return (
            <g key={`wall-${w}`}>
              <rect x={PAD + x * CELL + 4} y={PAD + y * CELL + 4} width={CELL - 8} height={CELL - 8} rx="6" fill={GREY[300]} />
              <rect x={PAD + x * CELL + 8} y={PAD + y * CELL + 8} width={CELL - 16} height={CELL - 16} rx="3" fill={GREY[200]} />
            </g>
          );
        })}

        {highlight && path.map((p, i) => (
          <circle key={`trace-${i}`} cx={PAD + p.x * CELL + CELL / 2} cy={PAD + p.y * CELL + CELL / 2} r="4" fill={GREEN[500]} opacity=".45" />
        ))}

        <g transform={`translate(${PAD + goalXY.x * CELL + CELL / 2} ${PAD + goalXY.y * CELL + CELL / 2})`}>
          <polygon points="0,-9 8,-3 5,8 -5,8 -8,-3" fill={BLUE[600]} stroke={BLUE[50]} strokeWidth="2" />
          <polygon points="0,-5 4,-2 3,3 -3,3 -4,-2" fill={BLUE[200]} />
        </g>

        <g
          transform={`translate(${PAD + agentXY.x * CELL + CELL / 2} ${PAD + agentXY.y * CELL + CELL / 2}) rotate(${angleFor(facing)})`}
          style={{ transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)" }}
        >
          <rect x="-10" y="-7" width="20" height="14" rx="4" fill={GREY[800]} />
          <rect x="-10" y="-7" width="20" height="6" rx="2" fill={BLUE[500]} />
          <circle cx="-6" cy="5" r="2.5" fill={GREY[600]} />
          <circle cx="6" cy="5" r="2.5" fill={GREY[600]} />
        </g>

        {solved && (
          <g transform={`translate(${PAD + goalXY.x * CELL + CELL / 2 + 10} ${PAD + goalXY.y * CELL + CELL / 2 - 10})`}>
            <circle r="8" fill={GREEN[500]} />
            <path d="M-3 0 L-1 3 L4 -3" fill="none" stroke={BLUE[50]} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
}

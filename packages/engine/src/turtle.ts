export type Cardinal = "up" | "down" | "left" | "right";
export type TurtleCommand = "turnLeft" | "turnRight" | "driveForward";

export type TurtleConfig = {
  width: number;
  height: number;
  start: number;
  goal: number;
  walls: number[];
  maxSteps: number;
  initialFacing?: Cardinal;
};

export type TurtleEvent =
  | { type: "turn"; from: Cardinal; to: Cardinal; command: TurtleCommand }
  | { type: "move"; from: number; to: number }
  | { type: "bump"; target: number }
  | { type: "win"; at: number }
  | { type: "timeout" };

export type TurtleState = TurtleConfig & {
  agent: number;
  facing: Cardinal;
  status: "playing" | "won" | "failed";
  history: TurtleCommand[];
  events: TurtleEvent[];
};

const LEFT_OF: Record<Cardinal, Cardinal> = {
  up: "left",
  left: "down",
  down: "right",
  right: "up",
};

const RIGHT_OF: Record<Cardinal, Cardinal> = {
  up: "right",
  right: "down",
  down: "left",
  left: "up",
};

function structuralErrors(config: TurtleConfig): string[] {
  const cells = config.width * config.height;
  const errors: string[] = [];
  if (config.width < 2 || config.height < 2) errors.push("grid must be at least 2x2");
  if (!Number.isInteger(config.start) || config.start < 0 || config.start >= cells) errors.push("start out of bounds");
  if (!Number.isInteger(config.goal) || config.goal < 0 || config.goal >= cells) errors.push("goal out of bounds");
  if (config.start === config.goal) errors.push("start and goal must differ");
  if (config.maxSteps < 1) errors.push("maxSteps must be positive");
  for (const wall of config.walls) {
    if (!Number.isInteger(wall) || wall < 0 || wall >= cells) errors.push(`wall ${wall} out of bounds`);
  }
  if (config.walls.includes(config.start)) errors.push("start cannot be wall");
  if (config.walls.includes(config.goal)) errors.push("goal cannot be wall");
  return errors;
}

export function createTurtle(config: TurtleConfig): TurtleState {
  const errors = structuralErrors(config);
  if (errors.length) throw new Error(errors.join("; "));
  return {
    ...config,
    walls: [...config.walls],
    initialFacing: config.initialFacing ?? "right",
    agent: config.start,
    facing: config.initialFacing ?? "right",
    status: "playing",
    history: [],
    events: [],
  };
}

function targetFor(state: TurtleState): number {
  const x = state.agent % state.width;
  const y = Math.floor(state.agent / state.width);
  if (state.facing === "left") return x === 0 ? -1 : state.agent - 1;
  if (state.facing === "right") return x === state.width - 1 ? -1 : state.agent + 1;
  if (state.facing === "up") return y === 0 ? -1 : state.agent - state.width;
  return y === state.height - 1 ? -1 : state.agent + state.width;
}

export function stepTurtle(state: TurtleState, command: TurtleCommand): TurtleState {
  if (state.status !== "playing") {
    return { ...state, walls: [...state.walls], history: [...state.history], events: [...state.events] };
  }
  const next: TurtleState = {
    ...state,
    walls: [...state.walls],
    history: [...state.history, command],
    events: [...state.events],
  };

  if (command === "turnLeft") {
    const previous = next.facing;
    next.facing = LEFT_OF[previous];
    next.events.push({ type: "turn", from: previous, to: next.facing, command });
  } else if (command === "turnRight") {
    const previous = next.facing;
    next.facing = RIGHT_OF[previous];
    next.events.push({ type: "turn", from: previous, to: next.facing, command });
  } else {
    const target = targetFor(next);
    if (target < 0 || state.walls.includes(target)) {
      next.events.push({ type: "bump", target });
    } else {
      const from = state.agent;
      next.agent = target;
      next.events.push({ type: "move", from, to: target });
      if (target === state.goal) {
        next.status = "won";
        next.events.push({ type: "win", at: target });
      }
    }
  }

  if (next.status === "playing" && next.history.length >= next.maxSteps) {
    next.status = "failed";
    next.events.push({ type: "timeout" });
  }
  return next;
}

export function runTurtleProgram(initial: TurtleState, program: TurtleCommand[]): TurtleState {
  return program.reduce((state, command) => stepTurtle(state, command), initial);
}

export const sampleTurtleConfig: TurtleConfig = {
  width: 6,
  height: 5,
  start: 0,
  goal: 22,
  walls: [10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27, 28, 29],
  maxSteps: 12,
  initialFacing: "right",
};

export const sampleTurtleProgram: TurtleCommand[] = [
  "driveForward",
  "driveForward",
  "driveForward",
  "turnRight",
  "driveForward",
  "driveForward",
  "driveForward",
  "turnLeft",
  "driveForward",
];

export type Direction = "up" | "down" | "left" | "right";

export type GridworldConfig = {
  width: number;
  height: number;
  start: number;
  goal: number;
  walls: number[];
  maxSteps: number;
};

export type GridworldEvent =
  | { type: "move"; from: number; to: number; command: Direction }
  | { type: "bump"; target: number }
  | { type: "win"; at: number }
  | { type: "timeout" };

export type GridworldState = GridworldConfig & {
  agent: number;
  status: "playing" | "won" | "failed";
  history: Direction[];
  events: GridworldEvent[];
};

export type GridworldValidation = {
  ok: boolean;
  uniqueSolution: Direction[] | null;
  acceptedPrograms: Direction[][];
  rejectedPrograms: Direction[][];
  errors: string[];
};

export function createGridworld(config: GridworldConfig): GridworldState {
  const errors = structuralErrors(config);
  if (errors.length) throw new Error(errors.join("; "));
  return { ...config, walls: [...config.walls], agent: config.start, status: "playing", history: [], events: [] };
}

function structuralErrors(config: GridworldConfig): string[] {
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

function targetFor(state: GridworldState, command: Direction): number {
  const x = state.agent % state.width;
  const y = Math.floor(state.agent / state.width);
  if (command === "left") return x === 0 ? -1 : state.agent - 1;
  if (command === "right") return x === state.width - 1 ? -1 : state.agent + 1;
  if (command === "up") return y === 0 ? -1 : state.agent - state.width;
  return y === state.height - 1 ? -1 : state.agent + state.width;
}

export function stepGridworld(state: GridworldState, command: Direction): GridworldState {
  if (state.status !== "playing") return { ...state, walls: [...state.walls], history: [...state.history], events: [...state.events] };
  const target = targetFor(state, command);
  const next: GridworldState = { ...state, walls: [...state.walls], history: [...state.history, command], events: [...state.events] };
  if (target < 0 || state.walls.includes(target)) {
    next.events.push({ type: "bump", target });
  } else {
    const from = state.agent;
    next.agent = target;
    next.events.push({ type: "move", from, to: target, command });
    if (target === state.goal) {
      next.status = "won";
      next.events.push({ type: "win", at: target });
    }
  }
  if (next.status === "playing" && next.history.length >= next.maxSteps) {
    next.status = "failed";
    next.events.push({ type: "timeout" });
  }
  return next;
}

export function runProgram(initial: GridworldState, program: Direction[]): GridworldState {
  return program.reduce((state, command) => stepGridworld(state, command), initial);
}

export function validateGridworld(config: GridworldConfig, candidatePrograms: Direction[][]): GridworldValidation {
  const errors = structuralErrors(config);
  if (errors.length) return { ok: false, uniqueSolution: null, acceptedPrograms: [], rejectedPrograms: candidatePrograms, errors };
  const acceptedPrograms: Direction[][] = [];
  const rejectedPrograms: Direction[][] = [];
  for (const program of candidatePrograms) {
    const final = runProgram(createGridworld(config), program);
    if (final.status === "won" && program.length <= config.maxSteps) acceptedPrograms.push(program);
    else rejectedPrograms.push(program);
  }
  return {
    ok: acceptedPrograms.length === 1,
    uniqueSolution: acceptedPrograms.length === 1 ? acceptedPrograms[0] : null,
    acceptedPrograms,
    rejectedPrograms,
    errors: acceptedPrograms.length === 1 ? [] : [`expected exactly one solution, found ${acceptedPrograms.length}`],
  };
}

export const sampleGridworldConfig: GridworldConfig = {
  width: 5,
  height: 5,
  start: 0,
  goal: 24,
  walls: [5, 6, 11, 13, 16, 21],
  maxSteps: 8,
};

export const sampleProgram: Direction[] = ["right", "right", "down", "down", "down", "right", "right", "down"];

export * from "./turtle";

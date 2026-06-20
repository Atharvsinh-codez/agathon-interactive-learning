import {
  sampleTurtleConfig,
  sampleTurtleProgram,
  type Cardinal,
  type TurtleCommand,
  type TurtleConfig,
} from "@blp/engine";

export type Stage =
  | "landing"
  | "onboard"
  | "course"
  | "skill"
  | "lesson"
  | "explain"
  | "complete"
  | "settings";

export type LessonResult = "idle" | "running" | "failed" | "solved";

export type LevelSpec = {
  id: number;
  title: string;
  prompt: string;
  config: TurtleConfig;
  program: TurtleCommand[];
  xp: number;
};

export const LEVELS: LevelSpec[] = [
  {
    id: 1,
    title: "Deliver package",
    prompt: "Drive forward and deliver the package.",
    config: { ...sampleTurtleConfig, goal: 2, walls: sampleTurtleConfig.walls.filter((w) => w !== 2), maxSteps: 3 },
    program: ["driveForward", "driveForward"],
    xp: 10,
  },
  {
    id: 2,
    title: "Turn the corner",
    prompt: "Reorder the commands. Make the robot reach the gem.",
    config: sampleTurtleConfig,
    program: sampleTurtleProgram,
    xp: 15,
  },
  {
    id: 3,
    title: "Around the block",
    prompt: "Drive, turn, and drive again to reach the gem.",
    config: { width: 5, height: 5, start: 0, goal: 7, walls: [11, 12], maxSteps: 6, initialFacing: "right" },
    program: ["driveForward", "driveForward", "turnRight", "driveForward"],
    xp: 20,
  },
];

export const COLS = sampleTurtleConfig.width;
export const ROWS = sampleTurtleConfig.height;
export const CELL = 30;
export const PAD = 16;
export const VB_W = COLS * CELL + PAD * 2;
export const VB_H = ROWS * CELL + PAD * 2;

export const BLUE = {
  50: "#EAF2FF", 100: "#D4E5FF", 200: "#A8CBFF", 300: "#7EB1FF",
  400: "#5696FF", 500: "#3079FF", 600: "#0051E6", 700: "#003CB5", 800: "#002A82",
};
export const GREY = {
  50: "#F9FAFB", 100: "#F3F4F6", 200: "#E5E7EB", 300: "#D1D5DB",
  400: "#9CA3AF", 500: "#6B7280", 600: "#4B5563", 700: "#374151", 800: "#1F2937", 900: "#111827",
};
export const GREEN = { 400: "#4ADE80", 500: "#22C55E", 600: "#16A34A", 900: "#064E3B" };

export type LessonCommand = TurtleCommand | "deliverPackage";

export function engineCommand(command: LessonCommand): TurtleCommand {
  return command === "deliverPackage" ? "driveForward" : command;
}

export function labelFor(command: LessonCommand) {
  if (command === "deliverPackage") return "package";
  return command === "turnLeft" ? "left" : command === "turnRight" ? "right" : "forward";
}

export function labelForSlot(command: LessonCommand) {
  return labelFor(command);
}

export function verbFor(command: LessonCommand) {
  if (command === "deliverPackage") return "deliver";
  return command === "driveForward" ? "drive" : "turn";
}

export function verbForSlot(command: LessonCommand) {
  return command === "deliverPackage" ? "deliver" : verbFor(command);
}

export function idxToXY(idx: number) {
  return { x: idx % COLS, y: Math.floor(idx / COLS) };
}

export function angleFor(facing: Cardinal) {
  return facing === "right" ? 0 : facing === "down" ? 90 : facing === "left" ? 180 : 270;
}

import { describe, expect, it } from "vitest";
import { createGridworld, stepGridworld, validateGridworld, runProgram } from "./index";

describe("gridworld deterministic engine", () => {
  it("moves an agent through legal commands without mutating the input state", () => {
    const state = createGridworld({ width: 4, height: 3, start: 0, goal: 11, walls: [5], maxSteps: 8 });
    const next = stepGridworld(state, "right");

    expect(state.agent).toBe(0);
    expect(next.agent).toBe(1);
    expect(next.history).toEqual(["right"]);
  });

  it("blocks movement into walls and records a bump event", () => {
    const state = createGridworld({ width: 4, height: 3, start: 1, goal: 11, walls: [5], maxSteps: 8 });
    const next = stepGridworld(state, "down");

    expect(next.agent).toBe(1);
    expect(next.events.at(-1)).toEqual({ type: "bump", target: 5 });
  });

  it("validates a candidate puzzle with exactly one correct solution", () => {
    const config = { width: 3, height: 3, start: 0, goal: 8, walls: [3, 4], maxSteps: 4 };
    const result = validateGridworld(config, [["right", "right", "down", "down"], ["down", "right", "right", "down"]]);

    expect(result.ok).toBe(true);
    expect(result.uniqueSolution).toEqual(["right", "right", "down", "down"]);
    expect(result.rejectedPrograms).toHaveLength(1);
  });

  it("runs a program to a won terminal state", () => {
    const state = createGridworld({ width: 3, height: 3, start: 0, goal: 8, walls: [3, 4], maxSteps: 4 });
    const final = runProgram(state, ["right", "right", "down", "down"]);

    expect(final.status).toBe("won");
    expect(final.agent).toBe(8);
  });
});

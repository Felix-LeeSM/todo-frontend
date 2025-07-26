import type { AssertExactExhaustive } from "@/shared/types.util";

export type TodoStatus = "TO_DO" | "IN_PROGRESS" | "DONE" | "ON_HOLD";

const ALL_STATUSES = ["TO_DO", "IN_PROGRESS", "ON_HOLD", "DONE"] as const;

export type TodoStatusArray = AssertExactExhaustive<TodoStatus, typeof ALL_STATUSES>;

export const TodoStatusEnum = {
  TO_DO: "TO_DO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  ON_HOLD: "ON_HOLD",
} as const;

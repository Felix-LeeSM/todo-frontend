import type { AssertExactExhaustive } from "@/shared/types.util";

export type GroupRole = "OWNER" | "MANAGER" | "MEMBER" | "VIEWER";

const ALL_ROLES = ["OWNER", "MANAGER", "MEMBER", "VIEWER"] as const;

export type GroupRoleArray = AssertExactExhaustive<GroupRole, typeof ALL_ROLES>;

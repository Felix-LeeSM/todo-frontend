import type { IGroup } from "@domain/group/types/Group.interface";

export type CreateGroupRequestDTO = Omit<IGroup, "id">;

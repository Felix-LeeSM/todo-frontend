import type { GroupInterface } from "@domain/group/types/Group.interface";
import { createContext } from "react";

export interface GroupContextType {
  group?: GroupInterface;
  handleSetGroup: (group?: GroupInterface) => void;
}

export const GroupContext = createContext<GroupContextType>({
  handleSetGroup: () => {},
});

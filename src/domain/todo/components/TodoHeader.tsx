import { Button } from "@domain/shared/components/ui/button";
import { AlertTriangle, GripVertical, Star, Trash2 } from "lucide-react";
import type { TodoWithStarred } from "../types/Todo";
import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { HTMLAttributes } from "react";

interface TodoHeaderProps {
  todo: TodoWithStarred;
  onToggleImportant: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  dragListeners?: DraggableSyntheticListeners;
  dragAttributes: HTMLAttributes<HTMLElement>;
}

export const TodoHeader = ({
  todo,
  onToggleImportant,
  onToggleStar,
  onDelete,
  dragListeners,
  dragAttributes
}: TodoHeaderProps) => (
  <div className="flex items-start gap-2">
    <div className="flex-shrink-0 mt-0.5" {...dragListeners} {...dragAttributes}>
      <GripVertical className="w-6 h-6 text-gray-400 cursor-grab hover:text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-md text-gray-900 leading-tight line-clamp-2">{todo.title}</h3>
    </div>
    <div className="flex items-center gap-0.5 flex-shrink-0">
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 ${todo.important ? "text-orange-500 hover:text-orange-600" : "text-gray-400 hover:text-orange-500"}`}
        onClick={onToggleImportant}
      >
        <AlertTriangle className="w-3 h-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 ${todo.isStarred ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-yellow-500"}`}
        onClick={onToggleStar}
      >
        <Star className={`w-3 h-3 ${todo.isStarred ? "fill-current" : ""}`} />
      </Button>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-red-500" onClick={onDelete}>
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  </div>
);

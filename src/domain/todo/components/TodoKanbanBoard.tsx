import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useGroupTodos } from "@domain/group/hooks/useGroupTodos";
import { DraggableTodoCard } from "@domain/todo/components/DraggableTodoCard";
import { DroppableTodoColumn } from "@domain/todo/components/DroppableTodoColumn";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus, TodoStatusArray } from "@domain/todo/types/TodoStatus";
import { useState } from "react";

type DragData = { type: "TODO_ITEM"; data: TodoWithStarred } | { type: "TODO_COLUMN"; data: TodoStatus };

/*
 TODO: Optimistic Update - useReducer Scenario
//  const [state, dispatch] = useReducer(todoReducer, initialTodos);
//
//  function todoReducer(state, action) {
//    switch (action.type) {
//      case 'MOVE_START':
//
//  Optional: Handle UI changes when dragging starts.
//        return state;
//      case 'MOVE_SUCCESS':
//
//  Before the API call, dispatch with the new optimistic state.
//
//  The reducer returns the optimistic state.
//
//  After the API call succeeds, dispatch again to finalize the state.
//        return action.payload.newState;
//      case 'MOVE_FAILURE':
//
//  On API failure, dispatch to roll back to the original state.
//        return action.payload.originalState;
//      default:
//        return state;
//    }
//  } */

interface TodoKanbanBoardProps {
  todos: TodoWithStarred[];
}

export function TodoKanbanBoard({ todos }: TodoKanbanBoardProps) {
  const [activeTodo, setActiveTodo] = useState<TodoWithStarred | null>(null);

  const { moveTodo } = useGroupTodos();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    // TODO: Optimistic Update - Reducer Action: 'MOVE_START'. Dispatch this when a user starts dragging an item. Can be used to manage UI state like isDragging.
    const { active } = event;
    if (active.data.current?.type === "TODO_ITEM") {
      setActiveTodo(active.data.current.data);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATodo = (active.data.current as DragData)?.type === "TODO_ITEM";
    const isOverAColumn = (over.data.current as DragData)?.type === "TODO_COLUMN";

    if (isActiveATodo && isOverAColumn) {
      const todoToMove = (active.data.current as DragData).data as TodoWithStarred;
      const newStatus = (over.data.current as DragData).data as TodoStatus;
      if (todoToMove && todoToMove.status !== newStatus) {
        // Optimistic update will handle this state change
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTodo(null);
    const { active, over } = event;
    if (!over) return;

    const activeDragData = active.data.current as DragData;
    const overDragData = over.data.current as DragData;

    if (activeDragData.type !== "TODO_ITEM") {
      return;
    }

    const todoToMove = activeDragData.data;

    let newStatus: TodoStatus;
    let destinationId: number | undefined;

    if (overDragData.type === "TODO_COLUMN") {
      newStatus = overDragData.data;
      // Dropped directly onto a column, implies end of list or empty column.
      // destinationId remains undefined.
    } else if (overDragData.type === "TODO_ITEM") {
      const overTodo = overDragData.data;
      newStatus = overTodo.status;

      // Get all todos in the overTodo's column, sorted by order
      const todosInOverColumn = todos
        .filter((t) => t.status === overTodo.status)
        .sort((a, b) => a.order.localeCompare(b.order));

      const lastTodoInColumn = todosInOverColumn[todosInOverColumn.length - 1];

      // Condition A: Check if the over item is the very last item in its respective column's list.
      const isOverLastItemInColumn = lastTodoInColumn && overTodo.id === lastTodoInColumn.id;

      // Condition B: Check the drop position relative to that last item.
      // Determine if the drop occurred in the bottom half of that last item.
      const overRect = event.over?.rect;
      const activeRect = event.active?.rect.current?.translated; // Use translated for current visual position

      let droppedInBottomHalf = false;
      if (overRect && activeRect) {
        const overMidpointY = overRect.top + overRect.height / 2;
        // If the top of the dragged item is below the midpoint of the over item, it's in the bottom half.
        droppedInBottomHalf = activeRect.top > overMidpointY;
      }

      if (isOverLastItemInColumn && droppedInBottomHalf) {
        destinationId = undefined; // Drop at the very end of the list
      } else {
        destinationId = overTodo.id; // Drop onto an existing todo item
      }
    } else {
      return;
    }

    // TODO: Optimistic Update - Reducer Action: 'MOVE_SUCCESS'. Dispatch this on API success. The reducer should have already handled the optimistic state change. This action confirms the state or updates it with fresh data from the server.
    moveTodo(todoToMove.id, newStatus, destinationId);
    // TODO: Optimistic Update - Reducer Action: 'MOVE_FAILURE'. Dispatch this on API failure. The reducer should receive the original state as part of the action payload to revert the UI to its pre-drag state (rollback).
  };

  const todoStatuses: TodoStatusArray = ["TO_DO", "IN_PROGRESS", "ON_HOLD", "DONE"];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {todoStatuses.map((status) => (
          <DroppableTodoColumn key={status} status={status} todos={todos.filter((todo) => todo.status === status)} />
        ))}
      </div>

      <DragOverlay>{activeTodo ? <DraggableTodoCard todo={activeTodo} /> : null}</DragOverlay>
    </DndContext>
  );
}

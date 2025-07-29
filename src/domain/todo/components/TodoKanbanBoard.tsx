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
import { DraggableTodoCard } from "@domain/todo/components/DraggableTodoCard";
import { DroppableTodoColumn } from "@domain/todo/components/DroppableTodoColumn";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus, TodoStatusArray } from "@domain/todo/types/TodoStatus";
import { useState } from "react";
import { generateOrderedString } from "@/shared/order";

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
  moveTodo: (todoId: number, newStatus: TodoStatus, order: string) => void;
}

export function TodoKanbanBoard({ todos, moveTodo }: TodoKanbanBoardProps) {
  const [activeTodo, setActiveTodo] = useState<TodoWithStarred | null>(null);

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
    // Optimistic Update를 위한 로직 (필요시 구현)
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTodo(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeDragData = active.data.current as DragData;
    if (activeDragData.type !== "TODO_ITEM") {
      return;
    }

    const todoToMove = activeDragData.data;
    const overData = over.data.current as DragData;

    // 1. 새로운 상태(컬럼) 결정
    const newStatus: TodoStatus =
      overData.type === "TODO_COLUMN" ? overData.data : (overData.data as TodoWithStarred).status;

    // 2. 이동할 컬럼의 todo들을 order 기준으로 정렬 (현재 이동 중인 아이템 제외)
    const sortedTodosInColumn = todos
      .filter((t) => t.status === newStatus && t.id !== todoToMove.id)
      .sort((a, b) => a.order.localeCompare(b.order));

    let newOrder: string;

    if (overData.type === "TODO_COLUMN") {
      const rightTodo = sortedTodosInColumn.at(0); // 컬럼의 첫 번째 아이템
      newOrder = generateOrderedString(undefined, rightTodo?.order);
    } else if (overData.type === "TODO_ITEM") {
      const overTodo = overData.data;

      // 드롭된 아이템의 절반 위/아래 중 어디에 위치하는지 판단
      const overRect = event.over?.rect;
      const activeRect = event.active?.rect.current?.translated;
      let droppedInBottomHalf = false;
      if (overRect && activeRect) {
        const overMidpointY = overRect.top + overRect.height / 2;
        droppedInBottomHalf = activeRect.top > overMidpointY;
      }

      const overIndex = sortedTodosInColumn.findIndex((t) => t.id === overTodo.id);

      if (droppedInBottomHalf) {
        const leftTodo = sortedTodosInColumn[overIndex];
        const rightTodo = sortedTodosInColumn[overIndex + 1];
        newOrder = generateOrderedString(leftTodo.order, rightTodo?.order);
      } else {
        const leftTodo = sortedTodosInColumn[overIndex - 1];
        const rightTodo = sortedTodosInColumn[overIndex];
        newOrder = generateOrderedString(leftTodo?.order, rightTodo.order);
      }
    } else {
      return; // 그 외의 경우는 무시
    }

    if (todoToMove.status === newStatus && todoToMove.order === newOrder) return;

    moveTodo(todoToMove.id, newStatus, newOrder);
    // TODO: Optimistic Update - Reducer Action: 'MOVE_SUCCESS'. Dispatch this on API success. The reducer should have already handled the optimistic state change. This action confirms the state or updates it with fresh data from the server.
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

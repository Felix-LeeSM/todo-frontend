import { useAuth } from "@domain/auth/hooks/useAuth";
import { useGroupInfo } from "@domain/group/hooks/useGroupInfo";
import { useGroupMembers } from "@domain/group/hooks/useGroupMembers";
import { useGroupTodos } from "@domain/group/hooks/useGroupTodos";
import { compareGroupRole } from "@domain/group/services/compareGroupRole";
import { Card, CardContent, CardHeader } from "@domain/shared/components/ui/card";
import { Input } from "@domain/shared/components/ui/input";
import { Textarea } from "@domain/shared/components/ui/textarea";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { AssigneeSelector } from "./AssigneeSelector";
import { DueDateSelector } from "./DueDateSelector";
import { TodoHeader } from "./TodoHeader";

interface DraggableTodoCardProps {
  todo: TodoWithStarred;
  isDragging: boolean;
}

export function DraggableTodoCard({ todo, isDragging }: DraggableTodoCardProps) {
  const { updateTodoMetadata, starTodo, unstarTodo, deleteTodo, updateTodoDetails } = useGroupTodos();
  const { myRole } = useGroupInfo();
  const { user } = useAuth();
  const { members } = useGroupMembers();
  const assignee = members.find((m) => m.id === todo.assigneeId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descTextareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditable = compareGroupRole(myRole, "gte", "MANAGER") || todo.authorId === user.id;

  useEffect(() => {
    if (!isEditingTitle && !isEditingDesc) {
      const trimmedTitle = inputTitle.trim();
      const trimmedDesc = inputDescription.trim();

      const finalTitle = trimmedTitle || todo.title;
      const finalDescription = trimmedDesc || (todo.description ?? "");

      if (finalTitle !== todo.title || finalDescription !== (todo.description ?? "")) {
        updateTodoDetails(todo.id, {
          title: finalTitle,
          description: finalDescription,
        });
      }

      setInputTitle("");
      setInputDescription("");
    }
  }, [isEditingTitle, isEditingDesc, todo, updateTodoDetails, inputTitle, inputDescription]);

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.focus();
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDesc) descTextareaRef.current?.focus();
  }, [isEditingDesc]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && e.currentTarget.tagName.toLowerCase() === "input") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setInputTitle("");
      setInputDescription("");
      e.currentTarget.blur();
    }
  };

  // --- 💡 2, 3번 문제 해결 ---
  const handleActivationKeyDown = (e: KeyboardEvent<HTMLDivElement>, field: "title" | "description") => {
    // 3. 이벤트 발생지가 핸들러가 붙은 div 자기 자신인지 확인 (자식 요소는 무시)
    if (e.target !== e.currentTarget) {
      return;
    }

    if (!isEditable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // 2. 이벤트 전파를 막아 DnD 라이브러리의 키보드 이동 로직 실행 방지
      e.stopPropagation();

      if (field === "title") setIsEditingTitle(true);
      if (field === "description") setIsEditingDesc(true);
    }
  };

  const toggleStar = () => (todo.isStarred ? unstarTodo(todo.id) : starTodo(todo.id));
  const toggleImportant = () => updateTodoMetadata(todo.id, { isImportant: !todo.important });
  const selectAssignee = (memberId?: number) => updateTodoMetadata(todo.id, { assigneeId: memberId ?? null });
  const selectDueDate = (dueDate?: Date) => {
    if (!dueDate) return updateTodoMetadata(todo.id, { dueDate: null });
    const timezoneOffset = dueDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dueDate.getTime() - timezoneOffset);
    updateTodoMetadata(todo.id, { dueDate: adjustedDate });
  };

  const focusStyle = "focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0";

  return (
    <Card
      key={todo.id}
      className={`border border-gray-200 hover:shadow-md transition-shadow duration-200 h-fit ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <CardHeader>
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            placeholder={todo.title}
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={handleInputKeyDown}
            className={`text-lg font-semibold h-auto p-0 border-none ${focusStyle}`}
          />
        ) : (
          <div
            onDoubleClick={() => isEditable && setIsEditingTitle(true)}
            onKeyDown={(e) => handleActivationKeyDown(e, "title")}
            role="button"
            tabIndex={isEditable ? 0 : -1}
            aria-label="제목 수정"
            // --- 💡 1번 문제 해결: cursor-pointer 제거로 커서 모양 통일 ---
            className="w-full rounded focus-visible:outline-blue-500"
          >
            <TodoHeader
              todo={todo}
              onToggleImportant={toggleImportant}
              onToggleStar={toggleStar}
              onDelete={() => deleteTodo(todo.id)}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isEditingDesc ? (
            <Textarea
              ref={descTextareaRef}
              placeholder={todo.description ?? "Todo에 대한 설명을 입력하세요."}
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              onBlur={() => setIsEditingDesc(false)}
              onKeyDown={handleInputKeyDown}
              className={`text-sm text-gray-600 min-h-[60px] ${focusStyle}`}
            />
          ) : (
            todo.description && (
              <div
                onDoubleClick={() => isEditable && setIsEditingDesc(true)}
                onKeyDown={(e) => handleActivationKeyDown(e, "description")}
                role="button"
                tabIndex={isEditable ? 0 : -1}
                aria-label="설명 수정"
                // --- 💡 1번 문제 해결: cursor-pointer 제거로 커서 모양 통일 ---
                className="w-full text-sm text-gray-600 whitespace-pre-wrap rounded focus-visible:outline-blue-500"
              >
                {todo.description}
              </div>
            )
          )}
          <div className="space-y-2">
            <DueDateSelector dueDate={todo.dueDate} onSelect={selectDueDate} />
            <AssigneeSelector assignee={assignee} members={members} onSelect={selectAssignee} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

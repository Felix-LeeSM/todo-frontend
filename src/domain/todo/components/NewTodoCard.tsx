import { useGroupTodos } from "@domain/group/hooks/useGroupTodos";
import type { Member } from "@domain/group/types/Member";
import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Badge } from "@domain/shared/components/ui/badge";
import { Button } from "@domain/shared/components/ui/button";
import { Calendar } from "@domain/shared/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@domain/shared/components/ui/popover";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AlertCircle, CalendarIcon, GripVertical, Star } from "lucide-react";
import { useState } from "react";

interface TodoCardProps {
  todo: TodoWithStarred;
  assignee?: Member;
}

export function NewTodoCard({ todo, assignee }: TodoCardProps) {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const { updateTodoMetadata, starTodo, unstarTodo } = useGroupTodos();

  const isLongDescription = todo.description && todo.description.length > 100;

  const toggleDescription = () => {
    setExpandedDescription((prev) => !prev);
  };

  const onToggleStar = () => {
    todo.isStarred ? unstarTodo(todo.id) : starTodo(todo.id);
  };

  const onToggleImportant = () => {
    todo.important
      ? updateTodoMetadata(todo.id, { isImportant: false })
      : updateTodoMetadata(todo.id, { isImportant: true });
  };

  const onDueDateSelect = (dueDate?: Date) => {
    if (!dueDate) {
      updateTodoMetadata(todo.id, { dueDate: null });
      return;
    }

    const timezoneOffset = dueDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dueDate.getTime() - timezoneOffset);
    updateTodoMetadata(todo.id, { dueDate: adjustedDate });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <GripVertical className="mr-2 h-4 w-4 text-gray-400" />
            {todo.title}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleImportant}
              className="p-1 h-auto"
              title="중요 표시 (그룹 공유)"
            >
              <AlertCircle className={`h-4 w-4 ${todo.important ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </Button>
            {/* Star 버튼 (개인화) */}
            <Button variant="ghost" size="sm" onClick={onToggleStar} className="p-1 h-auto" title="즐겨찾기 (개인)">
              <Star className={`h-4 w-4 ${todo.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {todo.description && (
          <div className="mb-3">
            <p className={`text-sm text-gray-600 ${!expandedDescription && isLongDescription ? "line-clamp-2" : ""}`}>
              {todo.description}
            </p>
            {isLongDescription && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                onClick={toggleDescription}
              >
                {expandedDescription ? "접기" : "더보기"}
              </Button>
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                {todo.dueDate ? (
                  <Badge
                    variant="outline"
                    // 👇 [수정] 버튼과 동일한 높이(h-6), 패딩(px-2), 정렬(flex items-center) 클래스 추가
                    className="h-6 px-2 text-xs flex items-center cursor-pointer hover:bg-gray-50"
                  >
                    {format(todo.dueDate, "MM/dd", { locale: ko })}
                  </Badge>
                ) : (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                  </Button>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  navLayout="after"
                  showOutsideDays={false}
                  mode="single"
                  required={false}
                  selected={todo.dueDate}
                  onSelect={onDueDateSelect}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xs">{assignee.nickname.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

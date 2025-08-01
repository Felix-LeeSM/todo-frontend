import { useAuth } from "@domain/auth/hooks/useAuth";
import { CalendarFilters } from "@domain/calendar/components/CalendarFilters";
import { CreateTodoWithGroupDialog } from "@domain/calendar/components/CreateTodoWithGroupDialog";
import { MainCalendar } from "@domain/calendar/components/MainCalendar";
import { TodoStatistics } from "@domain/calendar/components/TodoStatistics";
import { useGroupTodoFiltering } from "@domain/calendar/hooks/useGroupFiltering";
import { groupApi } from "@domain/group/services/groupApi";
import type { FullGroupDetails } from "@domain/group/types/Group";
import { Avatar, AvatarFallback } from "@domain/shared/components/ui/avatar";
import { Badge } from "@domain/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { todoApi } from "@domain/todo/services/todoApi";
import type { CreateTodoParams } from "@domain/todo/types/dto/todo.dto";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { AlertTriangle, CheckCircle, Clock, Pause, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toastErrorMessage } from "@/shared/toastErrorMessage";
import { toSorted } from "@/shared/toSorted";

export default function CalandarPage() {
  const now = new Date();

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  const [groups, setGroups] = useState<FullGroupDetails[]>([]);
  const [selectedDate, setSelectedDate] = useState(now);

  const { filteredTodos, filterState, actions } = useGroupTodoFiltering({ groups, myId: user.id, now });

  const handleCreateTodo = (groupId: number, todoParams: CreateTodoParams) => {
    todoApi
      .createTodo(todoParams, groupId)
      .then((newTodo) => {
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  todos: [{ ...newTodo, isStarred: false }, ...group.todos],
                }
              : group,
          ),
        );
      })
      .catch(toastErrorMessage);
  };

  const todosForSelectedDate = useMemo(
    () =>
      groups.flatMap((group) =>
        group.todos
          .filter((todo) => todo.dueDate && isSameDay(todo.dueDate, selectedDate))
          .map((todo) => ({
            ...todo,
            groupName: group.name,
            assignee: group.members.find((m) => m.id === todo.assigneeId),
          })),
      ),
    [groups, selectedDate],
  );

  const getTodoStatusIcon = (status: TodoStatus) => {
    switch (status) {
      case "TO_DO":
        return <Clock className="h-3 w-3 text-gray-600" />;

      case "IN_PROGRESS":
        return <AlertTriangle className="h-3 w-3 text-blue-600" />;

      case "ON_HOLD":
        return <Pause className="h-3 w-3 text-orange-500" />;

      case "DONE":
        return <CheckCircle className="h-3 w-3 text-green-600" />;

      default:
        return <Clock className="h-3 w-3 text-gray-600" />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const initialGroups = await groupApi.getGroups();

        const settledResults = await Promise.allSettled(initialGroups.map((group) => groupApi.getGroupById(group.id)));

        const fulfilledResults = settledResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        setGroups(toSorted(fulfilledResults, (a, b) => a.id - b.id));
        actions.onSetGroupsFilter(fulfilledResults.map((g) => g.id));
      } catch (err) {
        toastErrorMessage(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [actions.onSetGroupsFilter]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CalendarFilters groups={groups} actions={actions} filterState={filterState} now={now} />
            </CardHeader>
            <CardContent>
              <MainCalendar
                todos={filteredTodos}
                onSelectDate={(date) => setSelectedDate(date)}
                now={now}
                selectedDate={selectedDate}
                selectedMonth={filterState.selectedMonth}
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base lg:text-lg">
                  {format(selectedDate, "M월 d일 (E)", { locale: ko })}
                </CardTitle>
                <CreateTodoWithGroupDialog
                  selectedDate={selectedDate}
                  groups={groups}
                  onCreateTodo={handleCreateTodo}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-gray-500 text-center py-4">데이터를 불러오는 중...</p>
              ) : todosForSelectedDate.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  {format(selectedDate, "M월 d일", { locale: ko })}에 예정된 할일이 없습니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {todosForSelectedDate.map((todo) => (
                    <div key={todo.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTodoStatusIcon(todo.status)}
                          <span className="font-medium text-sm">{todo.title}</span>
                        </div>
                        {todo.isStarred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </div>
                      {todo.description && <p className="text-xs text-gray-600 mb-2">{todo.description}</p>}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {todo.groupName}
                        </Badge>
                        {todo.assignee && (
                          <Avatar className="h-5 w-5" title={todo.assignee.nickname}>
                            <AvatarFallback className="text-xs">{todo.assignee.nickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <TodoStatistics todos={filteredTodos} />
        </div>
      </div>
    </main>
  );
}

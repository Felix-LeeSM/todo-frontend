import { useAuth } from "@domain/auth/hooks/useAuth";
import { CalendarFilters } from "@domain/calendar/components/CalendarFilters";
import { CreateTodoWithGroupDialog } from "@domain/calendar/components/CreateTodoWithGroupDialog";
import { MainCalendar } from "@domain/calendar/components/MainCalendar";
import { TodoStatistics } from "@domain/calendar/components/TodoStatistics";
import { useGroupTodoFiltering } from "@domain/calendar/hooks/useGroupFiltering";
import { groupApi } from "@domain/group/services/groupApi";
import type { DetailedGroup } from "@domain/group/types/Group";
import type { Member } from "@domain/group/types/Member";
import { Avatar, AvatarFallback } from "@domain/shared/components/ui/avatar";
import { Badge } from "@domain/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { todoApi } from "@domain/todo/services/todoApi";
import type { CreateTodoParams } from "@domain/todo/types/dto/todo.dto";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Map as ImmutableMap } from "immutable";
import { AlertTriangle, CheckCircle, Clock, Pause, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toastErrorMessage } from "@/shared/toastErrorMessage";
import { toSorted } from "@/shared/toSorted";

export default function CalandarPage() {
  const now = new Date();

  const { user } = useAuth();

  const [groups, setGroups] = useState<DetailedGroup[]>([]);
  const [groupTodos, setGroupTodos] = useState<ImmutableMap<number, TodoWithStarred[]>>(ImmutableMap());
  const [groupMembers, setGroupMembers] = useState<ImmutableMap<number, Member[]>>(ImmutableMap());
  const [selectedDate, setSelectedDate] = useState(now);

  const { filteredTodos, filterState, actions } = useGroupTodoFiltering({ groupTodos, myId: user.id, now });

  const handleCreateTodo = (groupId: number, todoParams: CreateTodoParams) => {
    todoApi.createTodo(todoParams, groupId).then((todo) => {
      setGroupTodos((groupTodos) => groupTodos.update(groupId, [], (prev) => [{ ...todo, isStarred: false }, ...prev]));
    });
  };

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
    groupApi
      .getGroups()
      .then((groups) => {
        setGroups(toSorted(groups, (a, b) => a.id - b.id));
        actions.onSetGroupsFilter(groups.map((group) => group.id));

        Promise.allSettled(groups.map((group) => groupApi.getGroupById(group.id)))
          .then((results) => results.filter((result) => result.status === "fulfilled"))
          .then((results) => results.map((result) => result.value))
          .then((values) =>
            values.reduce(
              (acc, curr) => ({
                members: acc.members.set(curr.id, curr.members),
                todos: acc.todos.set(curr.id, curr.todos),
              }),
              {
                members: ImmutableMap<number, Member[]>(),
                todos: ImmutableMap<number, TodoWithStarred[]>(),
              },
            ),
          )
          .then((result) => {
            setGroupMembers(result.members);
            setGroupTodos(result.todos);
          });
      })
      .catch(toastErrorMessage);
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
              {/* Calendar Grid를 반응형으로 수정 */}
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
                  groupMembers={groupMembers}
                  groups={groups}
                  onCreateTodo={handleCreateTodo}
                />
              </div>
            </CardHeader>
            <CardContent>
              {
                <div className="space-y-3">
                  <p className="[&:not(:last-child)]:hidden text-sm text-gray-500 text-center py-4">
                    {format(selectedDate, "M월 d일", { locale: ko })}에 예정된 할일이 없습니다.
                  </p>
                  {groups
                    .map((group) => [group, groupTodos.get(group.id) || [], groupMembers.get(group.id) || []] as const)
                    .map(
                      ([group, todos, members]) =>
                        [
                          group,
                          todos.filter((todo) => todo.dueDate && isSameDay(todo.dueDate, selectedDate)),
                          members,
                        ] as const,
                    )
                    .map(([group, todos, members]) =>
                      todos.map((todo) => {
                        const assignee = members.find((m) => m.id === todo.assigneeId);
                        return (
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
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {group.name}
                                </Badge>
                              </div>
                              {assignee && (
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">{assignee.nickname.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        );
                      }),
                    )}
                </div>
              }
            </CardContent>
          </Card>

          <TodoStatistics todos={filteredTodos} />
        </div>
      </div>
    </main>
  );
}

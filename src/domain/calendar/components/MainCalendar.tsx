import { toDateString } from "@domain/todo/services/mapper";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { AlertCircle, Star } from "lucide-react";
import { type KeyboardEvent, useMemo } from "react";
import { ko } from "react-day-picker/locale";
import { mergeClassNames } from "@/shared/mergeClassNames";

interface MainCalendarProps {
  now: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  selectedMonth: Date;
  todos: TodoWithStarred[];
}

export function MainCalendar({ selectedDate, selectedMonth, onSelectDate, todos, now }: MainCalendarProps) {
  const monthStart = startOfMonth(selectedMonth);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(monthStart)),
  });

  const weekdays = calendarDays.slice(0, 7).map((day) => format(day, "EEE", { locale: ko }));

  const todosByDate = useMemo(() => {
    return todos.reduce((acc, todo) => {
      if (!todo.dueDate) return acc;

      const dateKey = toDateString(todo.dueDate);
      const existingTodos = acc.get(dateKey);

      if (existingTodos) existingTodos.push(todo);
      else acc.set(dateKey, [todo]);

      return acc;
    }, new Map<string, TodoWithStarred[]>());
  }, [todos]);

  return (
    <>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 lg:text-sm">
        {weekdays.map((day) => (
          <div key={day} className="p-1 lg:p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays
          .map((day) => ({
            day,
            dateKey: toDateString(day),
            dayTodos: todosByDate.get(toDateString(day)) || [],

            isCurrentMonth: isSameMonth(day, selectedMonth),
            isSelected: isSameDay(day, selectedDate),
            isToday: isSameDay(day, now),

            handleKeyDown: (e: KeyboardEvent) => {
              if (isSameMonth(day, selectedMonth) && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelectDate(day);
              }
            },
          }))
          .map(({ day, dateKey, dayTodos, isCurrentMonth, isSelected, isToday, handleKeyDown }) => (
            <div
              key={dateKey}
              onClick={() => isCurrentMonth && onSelectDate(day)}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={isCurrentMonth ? 0 : -1}
              aria-disabled={!isCurrentMonth}
              aria-label={`${format(day, "M월 d일")}, ${dayTodos.length}개의 할 일`}
              className={mergeClassNames(
                "min-h-20 rounded-lg border p-1 text-left lg:min-h-25 lg:p-2 flex flex-col justify-start",
                {
                  "border-blue-400": isToday,
                  "border-gray-200": !isToday,
                  "bg-blue-50 border-blue-200": isSelected,
                  "hover:bg-gray-50": !isSelected && isCurrentMonth,
                  "opacity-50": !isCurrentMonth,
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:relative focus:z-10":
                    isCurrentMonth,
                },
              )}
            >
              <div
                className={mergeClassNames("mb-1 text-xs font-medium lg:text-sm", {
                  "text-blue-600": isToday,
                  "text-gray-900": !isToday,
                })}
              >
                {format(day, "d")}
              </div>

              <div className="space-y-1 cursor-default">
                {dayTodos.slice(0, 2).map((todo) => (
                  <div key={todo.id} className="flex items-center space-x-1 rounded border bg-white p-1 text-xs">
                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400 lg:h-2 lg:w-2" />
                    <span className="flex-1 truncate text-xs">{todo.title}</span>
                    {todo.important && (
                      <AlertCircle className="h-2.5 w-2.5 flex-shrink-0 fill-red-500 text-red-500 lg:h-3 lg:w-3" />
                    )}
                    {todo.isStarred && (
                      <Star className="h-2.5 w-2.5 flex-shrink-0 fill-yellow-400 text-yellow-400 lg:h-3 lg:w-3" />
                    )}
                  </div>
                ))}
                {dayTodos.length > 2 && <div className="text-center text-xs text-gray-500">+{dayTodos.length - 2}</div>}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

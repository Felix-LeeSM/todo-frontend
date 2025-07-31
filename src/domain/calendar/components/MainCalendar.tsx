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

interface MainCalendarProps {
  now: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  selectedMonth: Date;
  todos: TodoWithStarred[];
}

export function MainCalendar({ selectedDate, selectedMonth, onSelectDate, todos, now }: MainCalendarProps) {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="p-1 lg:p-2 text-center text-xs lg:text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dayTodos = todos.filter((todo) => todo.dueDate && isSameDay(day, todo.dueDate));
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, now);

          return (
            <div
              key={day.toISOString()}
              className={`
                    min-h-[80px] lg:min-h-[100px] p-1 lg:p-2 border rounded-lg cursor-pointer transition-colors
                    ${isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}
                    ${isToday ? "border-blue-400" : "border-gray-200"}
                    ${!isSameMonth(day, selectedMonth) ? "opacity-50" : ""}
                  `}
              onClick={() => (isSameMonth(day, selectedMonth) ? onSelectDate(day) : null)}
            >
              <div
                className={`
                    text-xs lg:text-sm font-medium mb-1
                    ${isToday ? "text-blue-600" : "text-gray-900"}
                  `}
              >
                {format(day, "d")}
              </div>

              <div className="space-y-1">
                {dayTodos.slice(0, 2).map((todo) => (
                  <div key={todo.id} className="flex items-center space-x-1 text-xs p-1 rounded bg-white border">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full" />
                    <span className="truncate flex-1 text-xs">{todo.title}</span>
                    {todo.important && <AlertCircle className="h-2.5 w-2.5 lg:h-3 lg:w-3 fill-red-500 text-red-500" />}
                    {todo.isStarred && <Star className="h-2.5 w-2.5 lg:h-3 lg:w-3 fill-yellow-400 text-yellow-400" />}
                  </div>
                ))}
                {dayTodos.length > 2 && <div className="text-xs text-gray-500 text-center">+{dayTodos.length - 2}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

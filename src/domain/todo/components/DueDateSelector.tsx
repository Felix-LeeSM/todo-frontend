import { Button } from "@domain/shared/components/ui/button";
import { Calendar } from "@domain/shared/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@domain/shared/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { mergeClassNames } from "@/shared/mergeClassNames";

export const DueDateSelector = ({ dueDate, onSelect }: { dueDate?: Date | null; onSelect: (date?: Date) => void }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (dueDate?: Date) => {
    if (dueDate) {
      const timezoneOffsetMs = dueDate.getTimezoneOffset() * 60 * 1000;
      const adjustedTime = dueDate.getTime() - timezoneOffsetMs;
      onSelect(new Date(adjustedTime));
    } else {
      onSelect();
    }
    setOpen(false);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            size={"default"}
            className={mergeClassNames(
              "w-full justify-start text-left font-normal",
              !dueDate && "text-muted-foreground",
              "shadow-sm",
            )}
            aria-label={dueDate ? `선택된 날짜: ${format(dueDate, "yy년 M월 d일", { locale: ko })}` : "날짜 선택"}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate ? format(dueDate, "M월 d일") : <span>{"날짜 선택"}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            fixedWeeks={true}
            mode="single"
            selected={dueDate ? dueDate : undefined}
            onSelect={handleSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      {dueDate && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleSelect()}
          className={"h-8 w-8"}
          aria-label="선택된 날짜 지우기"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">날짜 지우기</span>
        </Button>
      )}
    </div>
  );
};

import type { Member } from "@domain/group/types/Member";
import { Button } from "@domain/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@domain/shared/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@domain/shared/components/ui/popover";
import { Check, User, X } from "lucide-react";
import { useState } from "react";
import { mergeClassNames } from "@/shared/mergeClassNames";

export function AssigneeSelector({
  assignee,
  members,
  onSelect,
}: {
  assignee?: Member;
  members: Member[];
  onSelect: (memberId?: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect();
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            aria-expanded={open}
            className={mergeClassNames(
              "w-full justify-start text-left font-normal",
              !assignee && "text-muted-foreground",
              "shadow-sm truncate whitespace-nowrap",
            )}
            aria-label={assignee ? `선택된 사용자: ${assignee.nickname}` : "담당자 선택"}
          >
            <User className="mr-2 h-4 w-4" />
            {assignee ? assignee.nickname : <span>{"담당자 선택"}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          style={{ minWidth: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput
              placeholder="사용자 검색..."
              onKeyDown={(e) => {
                if (e.key === " ") e.stopPropagation();
              }}
            />
            <CommandList onMouseDown={(e) => e.preventDefault()}>
              <CommandEmpty>사용자를 찾을 수 없습니다.</CommandEmpty>
              <CommandGroup heading="사용자">
                {members.map((member) => (
                  <CommandItem
                    key={member.id}
                    value={member.nickname}
                    onSelect={() => {
                      if (assignee?.id !== member.id) {
                        onSelect(member.id);
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={mergeClassNames(
                        "mr-2 h-4 w-4",
                        assignee?.id === member.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {member.nickname}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {assignee && (
        <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8" aria-label="선택된 사용자 지우기">
          <X className="h-4 w-4" />
          <span className="sr-only">사용자 지우기</span>
        </Button>
      )}
    </div>
  );
}

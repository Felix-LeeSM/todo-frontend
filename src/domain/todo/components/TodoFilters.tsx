import type { Member } from "@domain/group/types/Member";
import { Button } from "@domain/shared/components/ui/button";
import { Input } from "@domain/shared/components/ui/input";
import { Label } from "@domain/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@domain/shared/components/ui/select";
import { useEffect, useState } from "react";
import type { todoFilter } from "../types/props";

interface TodoFiltersProps {
  filterState: {
    filterType: todoFilter;
    customDays: number;
    assigneeId: number | null;
  };
  members: Member[];
  actions: {
    onFilterTypeChange: (type: todoFilter) => void;
    onCustomDaysChange: (days: number) => void;
    onAssigneeChange: (id: number | null) => void;
  };
}

export function TodoFilters({ filterState, members, actions }: TodoFiltersProps) {
  const { filterType, customDays, assigneeId } = filterState;
  const { onFilterTypeChange, onCustomDaysChange, onAssigneeChange } = actions;

  const [isEditingDays, setIsEditingDays] = useState(false);
  const [tempDays, setTempDays] = useState(String(customDays));

  useEffect(() => {
    setTempDays(String(customDays));
  }, [customDays]);

  const handleCustomClick = () => {
    if (filterType === "custom" && !isEditingDays) {
      setIsEditingDays(true);
      return;
    }
    onFilterTypeChange("custom");
  };

  const handleDaysUpdate = () => {
    const newDays = Number(tempDays);
    if (newDays > 0) {
      onCustomDaysChange(newDays);
    }
    setTempDays(String(customDays));
    setIsEditingDays(false);
  };

  const handleDaysInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleDaysUpdate();
    if (e.key === "Escape") setIsEditingDays(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filterType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterTypeChange("all")}
        >
          전체
        </Button>
        <Button
          variant={filterType === "today" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterTypeChange("today")}
        >
          오늘
        </Button>
        <Button
          variant={filterType === "thisWeek" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterTypeChange("thisWeek")}
        >
          이번주
        </Button>

        <Button
          variant={filterType === "custom" ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={handleCustomClick}
        >
          {filterType === "custom" && isEditingDays ? (
            <Input
              type="number"
              min="1"
              max="365"
              value={tempDays}
              onChange={(e) => setTempDays(e.target.value)}
              onBlur={handleDaysUpdate}
              onKeyDown={handleDaysInputKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-6 text-xs p-1 bg-transparent border-none text-center"
              autoFocus
            />
          ) : (
            <span>{customDays}</span>
          )}
          <span>일 후까지</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium whitespace-nowrap">담당자:</Label>
        <Select
          value={assigneeId?.toString() || "all"}
          onValueChange={(value) => onAssigneeChange(value === "all" ? null : Number(value))}
        >
          {/* ... (Select 내부는 동일) */}
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id.toString()}>
                {member.nickname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

import type { DetailedGroup } from "@domain/group/types/Group";
import { Badge } from "@domain/shared/components/ui/badge";
import { Button } from "@domain/shared/components/ui/button";
import { CardTitle } from "@domain/shared/components/ui/card";
import { Label } from "@domain/shared/components/ui/label";
import { addMonths, format, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  groups: DetailedGroup[];
  now: Date;
  actions: {
    onMyTodosOnlyChange: (showMine: boolean) => void;
    onImportantOnlyChange: (showImportant: boolean) => void;
    onStarredOnlyChange: (showStarred: boolean) => void;
    onSetGroupsFilter: (ids: number[]) => void;
    onAddGroupFilter: (id: number) => void;
    onRemoveGroupFilter: (id: number) => void;
    onMonthChange: (date: Date) => void;
  };
  filterState: {
    selectedMonth: Date;
    showImportantOnly: boolean;
    showMyTodos: boolean;
    showStarredOnly: boolean;
    groupIdsFilter: Immutable.Set<number>;
  };
}

export function CalendarFilters({ groups, actions, filterState, now }: CalendarHeaderProps) {
  const { selectedMonth } = filterState;
  const {
    onMyTodosOnlyChange,
    onImportantOnlyChange,
    onStarredOnlyChange,
    onSetGroupsFilter,
    onAddGroupFilter,
    onRemoveGroupFilter,
    onMonthChange,
  } = actions;

  const isAllSelected = filterState.groupIdsFilter.size === groups.length;

  const toggleGroupFilter = (groupId: number) => {
    if (filterState.groupIdsFilter.has(groupId)) {
      onRemoveGroupFilter(groupId);
    } else {
      onAddGroupFilter(groupId);
    }
  };

  const toggleAllGroups = () => {
    if (isAllSelected) {
      onSetGroupsFilter([]);
    } else {
      onSetGroupsFilter(groups.map((group) => group.id));
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle className="text-xl lg:text-2xl">{format(selectedMonth, "yyyy년 MMMM", { locale: ko })}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onMonthChange(subMonths(selectedMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMonthChange(now)}>
            오늘
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMonthChange(addMonths(selectedMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label className="text-sm font-medium whitespace-nowrap">그룹:</Label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {groups.map((group) => (
                <Badge
                  key={group.id}
                  variant={filterState.groupIdsFilter.includes(group.id) ? "default" : "outline"}
                  className="cursor-pointer text-xs whitespace-nowrap shrink-0"
                  onClick={() => {
                    toggleGroupFilter(group.id);
                  }}
                >
                  {group.name}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toggleAllGroups()}>
            {isAllSelected ? "전체 해제" : "전체 선택"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterState.showMyTodos}
              onChange={() => onMyTodosOnlyChange(!filterState.showMyTodos)}
              className="rounded"
            />
            <span className="text-sm">내 할일만 보기</span>
          </Label>
          <Label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterState.showStarredOnly}
              onChange={() => onStarredOnlyChange(!filterState.showStarredOnly)}
              className="rounded"
            />
            <span className="text-sm">즐겨찾기만 보기</span>
          </Label>

          <Label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterState.showImportantOnly}
              onChange={() => onImportantOnlyChange(!filterState.showImportantOnly)}
              className="rounded"
            />
            <span className="text-sm">중요한 일만 보기</span>
          </Label>
        </div>
      </div>
    </>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import type { Todo } from "@domain/todo/types/Todo";

interface TodoStatisticsProps {
  todos: Todo[];
}

export function TodoStatistics({ todos }: TodoStatisticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base lg:text-lg">이번 달 통계</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">전체 할일</span>
            <span className="font-medium">{todos.length}개</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">완료</span>
            <span className="font-medium text-green-600">{todos.filter((t) => t.status === "DONE").length}개</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">진행중</span>
            <span className="font-medium text-blue-600">
              {todos.filter((t) => t.status === "IN_PROGRESS").length}개
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">대기중</span>
            <span className="font-medium text-gray-600">{todos.filter((t) => t.status === "TO_DO").length}개</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">보류중</span>
            <span className="font-medium text-gray-600">{todos.filter((t) => t.status === "ON_HOLD").length}개</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

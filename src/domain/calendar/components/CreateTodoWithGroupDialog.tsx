import type { DetailedGroup } from "@domain/group/types/Group";
import type { Member } from "@domain/group/types/Member";
import { Button } from "@domain/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@domain/shared/components/ui/dialog";
import { Input } from "@domain/shared/components/ui/input";
import { Label } from "@domain/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@domain/shared/components/ui/select";
import { Textarea } from "@domain/shared/components/ui/textarea";
import type { CreateTodoParams } from "@domain/todo/types/dto/todo.dto";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Map as ImmutableMap } from "immutable";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateTodoWithGroupDialogProps {
  selectedDate: Date;
  groupMembers: ImmutableMap<number, Member[]>;
  groups: DetailedGroup[];
  onCreateTodo: (groupId: number, todoParams: CreateTodoParams) => void;
}

export function CreateTodoWithGroupDialog({
  selectedDate,
  groupMembers,
  groups,
  onCreateTodo,
}: CreateTodoWithGroupDialogProps) {
  const [formData, setFormData] = useState<CreateTodoParams & { groupId?: number }>({
    title: "",
    description: "",
    dueDate: undefined,
    assigneeId: undefined,
    groupId: undefined,
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-3 w-3" />
          추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>할일 추가</DialogTitle>
          <DialogDescription>
            {format(selectedDate, "M월 d일", { locale: ko })}에 새로운 할일을 추가합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="todoTitle">제목</Label>
            <Input
              id="todoTitle"
              placeholder="할일 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="todoDescription">설명 (선택사항)</Label>
            <Textarea
              id="todoDescription"
              placeholder="할일에 대한 상세 설명을 입력하세요"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>그룹</Label>
            <Select
              value={formData.groupId?.toString()}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, groupId: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>담당자</Label>
            <Select
              value={formData.assigneeId?.toString()}
              disabled={formData.groupId === undefined}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, assigneeId: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {formData.groupId &&
                  (groupMembers.get(formData.groupId) || []).map((member) => (
                    <SelectItem key={member.id} value={member.nickname}>
                      {member.nickname}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                const { groupId, ...data } = formData;
                if (!groupId) return;

                onCreateTodo(groupId, data);
                setIsOpen(false);
              }}
            >
              할일 추가
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

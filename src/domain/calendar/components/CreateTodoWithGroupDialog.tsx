import type { FullGroupDetails } from "@domain/group/types/Group";
import { Button } from "@domain/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@domain/shared/components/ui/dialog";
import { Input } from "@domain/shared/components/ui/input";
import { Label } from "@domain/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@domain/shared/components/ui/select";
import { Textarea } from "@domain/shared/components/ui/textarea";
import type { CreateTodoParams } from "@domain/todo/types/dto/todo.dto";
import type { TodoStatus, TodoStatusArray } from "@domain/todo/types/TodoStatus";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface CreateTodoWithGroupDialogProps {
  selectedDate: Date;
  groups: FullGroupDetails[];
  onCreateTodo: (groupId: number, todoParams: CreateTodoParams) => Promise<void> | void;
}

const TODO_STATUS_LABEL: Record<TodoStatus, string> = {
  TO_DO: "할 일",
  IN_PROGRESS: "진행 중",
  ON_HOLD: "보류",
  DONE: "완료",
};

const TodoStatuses: TodoStatusArray = ["TO_DO", "IN_PROGRESS", "ON_HOLD", "DONE"];

interface FormData {
  title: string;
  description: string;
  status: TodoStatus;
  groupId?: number;
  assigneeId?: number;
}

const initialState: FormData = {
  title: "",
  description: "",
  status: "TO_DO",
  groupId: undefined,
  assigneeId: undefined,
};

export function CreateTodoWithGroupDialog({ selectedDate, groups, onCreateTodo }: CreateTodoWithGroupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialState);

  const selectedGroup = useMemo(() => {
    return groups.find((g) => g.id === formData.groupId);
  }, [formData.groupId, groups]);

  const handleResetAndClose = () => {
    setFormData(initialState);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("할일 제목을 입력해야 합니다.");
      return;
    }
    if (!formData.groupId) {
      toast.error("그룹을 선택해야 합니다.");
      return;
    }

    const { groupId, ...todoParams } = formData;

    onCreateTodo(groupId, { ...todoParams, dueDate: selectedDate });
    handleResetAndClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleResetAndClose())}>
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
            {format(selectedDate, "M월 d일 (E)", { locale: ko })}에 새로운 할일을 추가합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="todoTitle">제목</Label>
            <Input
              id="todoTitle"
              placeholder="할일 제목"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="todoDescription">설명 (선택)</Label>
            <Textarea
              id="todoDescription"
              placeholder="상세 설명"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selectTodoGroup">그룹</Label>
              <Select
                value={formData.groupId?.toString() ?? ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, groupId: Number(value), assigneeId: undefined }));
                }}
              >
                <SelectTrigger id="selectTodoGroup">
                  <SelectValue placeholder="그룹 선택" />
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
              <Label htmlFor="selectTodoStatus">상태</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TodoStatus) => {
                  setFormData((prev) => ({ ...prev, status: value }));
                }}
              >
                <SelectTrigger id="selectTodoStatus">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  {TodoStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {TODO_STATUS_LABEL[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="selectTodoAssignee">담당자 (선택)</Label>
            <Select
              value={formData.assigneeId?.toString() ?? ""}
              disabled={!selectedGroup}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, assigneeId: value !== "remove" ? Number(value) : undefined }))
              }
            >
              <SelectTrigger id="selectTodoAssignee">
                <SelectValue placeholder="담당자 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remove">담당자 없음</SelectItem>
                {selectedGroup?.members.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.nickname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleResetAndClose}>
            취소
          </Button>
          <Button onClick={handleSubmit}>할일 추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import type { Member } from "@domain/group/types/Member";
import { Button } from "@domain/shared/components/ui/button";
import { Calendar } from "@domain/shared/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@domain/shared/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@domain/shared/components/ui/select";
import { Textarea } from "@domain/shared/components/ui/textarea";
import type { CreateTodoParams } from "@domain/todo/types/dto/todo.dto";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";

interface CreateTodoDialogProps {
  members: Member[];
  onCreateTodo: (data: CreateTodoParams) => void;
}

export function CreateTodoDialog({ members, onCreateTodo }: CreateTodoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTodo, setNewTodo] = useState<CreateTodoParams>({
    title: "",
    description: "",
  });

  const handleCreateTodo = () => {
    if (newTodo.title.trim()) {
      onCreateTodo(newTodo);
      setNewTodo({
        title: "",
        description: "",
        dueDate: undefined,
        assigneeId: undefined,
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          할일 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 할일 추가</DialogTitle>
          <DialogDescription>새로운 할일을 추가하고 팀원에게 할당하세요.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="todoTitle">제목</Label>
            <Input
              id="todoTitle"
              placeholder="할일 제목을 입력하세요"
              value={newTodo.title}
              onChange={(e) => setNewTodo((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="todoDescription">설명 (선택사항)</Label>
            <Textarea
              id="todoDescription"
              placeholder="할일에 대한 상세 설명을 입력하세요"
              value={newTodo.description}
              onChange={(e) => setNewTodo((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>담당자</Label>
            <Select
              value={newTodo.assigneeId?.toString()}
              onValueChange={(value) => setNewTodo((prev) => ({ ...prev, assigneeId: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.nickname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>마감일 (선택사항)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTodo.dueDate ? format(newTodo.dueDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newTodo.dueDate}
                  onSelect={(date) => setNewTodo((prev) => ({ ...prev, dueDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateTodo}>할일 추가</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

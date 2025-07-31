import type {
  CreateTodoParams,
  CreateTodoRequestDTO,
  TodoResponseDTO,
  TodoWithStarredStatusResponseDTO,
  UpdateTodoMetadataParams,
  UpdateTodoMetadataRequestDTO,
} from "@domain/todo/types/dto/todo.dto";
import type { Todo, TodoWithStarred } from "@domain/todo/types/Todo";
import { format } from "date-fns";

export const toTodo = (todoDto: TodoResponseDTO): Todo => ({
  id: todoDto.id,
  title: todoDto.title,
  description: todoDto.description,
  status: todoDto.status,
  authorId: todoDto.authorId,
  groupId: todoDto.groupId,
  order: todoDto.order,
  dueDate: todoDto.dueDate ? new Date(todoDto.dueDate) : undefined,
  assigneeId: todoDto.assigneeId,
  important: todoDto.isImportant,
});

export const toTodoWithStarred = (todoDto: TodoWithStarredStatusResponseDTO): TodoWithStarred => {
  return {
    id: todoDto.id,
    title: todoDto.title,
    description: todoDto.description,
    status: todoDto.status,
    authorId: todoDto.authorId,
    groupId: todoDto.groupId,
    order: todoDto.order,
    dueDate: todoDto.dueDate ? new Date(todoDto.dueDate) : undefined,
    assigneeId: todoDto.assigneeId,
    important: todoDto.isImportant,
    isStarred: todoDto.isStarred,
  };
};

export const toCreateTodoRequestDTO = (params: CreateTodoParams): CreateTodoRequestDTO => ({
  title: params.title,
  description: params.description,
  dueDate: toDateString(params.dueDate),
  assigneeId: params.assigneeId,
});

export const toUpdateTodoMetadataRequestDTO = (params: UpdateTodoMetadataParams): UpdateTodoMetadataRequestDTO => ({
  isImportant: params.isImportant,
  dueDate: params.dueDate !== null ? toDateString(params.dueDate) : null,
  assigneeId: params.assigneeId,
});

export function toDateString(date: Date): string;
export function toDateString(date: undefined): undefined;
export function toDateString(date?: Date): string | undefined;

export function toDateString(date?: Date): string | undefined {
  if (!date) return undefined;

  return format(date, "yyyy-MM-dd");
}

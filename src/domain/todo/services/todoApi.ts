import { toCreateTodoRequestDTO, toTodo, toUpdateTodoMetadataRequestDTO } from "@domain/todo/services/mapper";
import type {
  CreateTodoParams,
  MoveTodoRequestDTO,
  TodoResponseDTO,
  UpdateTodoMetadataParams,
  UpdateTodoMetadataRequestDTO,
  UpdateTodoRequestDTO,
} from "@domain/todo/types/dto/todo.dto";
import type { Todo } from "@domain/todo/types/Todo";
import axios from "axios";

export const todoApi = {
  getTodos: (groupId: number): Promise<Todo[]> => {
    return axios.get<TodoResponseDTO[]>(`/api/v1/group/${groupId}/todo`).then((res) => res.data.map(toTodo));
  },

  createTodo: (todo: CreateTodoParams, groupId: number): Promise<Todo> => {
    return axios
      .post<TodoResponseDTO>(`/api/v1/group/${groupId}/todo`, toCreateTodoRequestDTO(todo))
      .then((res) => toTodo(res.data));
  },

  updateTodo: (groupId: number, todoId: number, todo: UpdateTodoRequestDTO): Promise<Todo> => {
    return axios.put<TodoResponseDTO>(`/api/v1/group/${groupId}/todo/${todoId}`, todo).then((res) => toTodo(res.data));
  },

  updateMetadata: (groupId: number, todoId: number, data: UpdateTodoMetadataParams): Promise<Todo> => {
    const requestBody: UpdateTodoMetadataRequestDTO = toUpdateTodoMetadataRequestDTO(data);
    return axios
      .patch<TodoResponseDTO>(`/api/v1/group/${groupId}/todo/${todoId}/metadata`, requestBody)
      .then((res) => toTodo(res.data));
  },

  deleteTodo: (groupId: number, todoId: number): Promise<void> => {
    return axios.delete(`/api/v1/group/${groupId}/todo/${todoId}`);
  },

  moveTodo: (groupId: number, todoId: number, data: MoveTodoRequestDTO): Promise<Todo> => {
    return axios
      .put<TodoResponseDTO>(`/api/v1/group/${groupId}/todo/${todoId}/move`, data)
      .then((res) => toTodo(res.data));
  },

  starTodo: (groupId: number, todoId: number): Promise<void> => {
    return axios.post(`/api/v1/group/${groupId}/todo/${todoId}/star`);
  },

  unstarTodo: (groupId: number, todoId: number): Promise<void> => {
    return axios.delete(`/api/v1/group/${groupId}/todo/${todoId}/star`);
  },
};

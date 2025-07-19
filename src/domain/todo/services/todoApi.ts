import type { CreateTodoRequestDTO, ITodo } from "@domain/todo/types/Todo.interface";
import axios from "axios";

export const todoApi = {
  getTodos: (groupId: number): Promise<ITodo[]> => {
    return axios.get<ITodo[]>(`/api/v1/group/${groupId}/todo`).then((res) => res.data);
  },

  createTodo: (todo: CreateTodoRequestDTO, groupId: number): Promise<ITodo> => {
    return axios.post<ITodo>(`/api/v1/group/${groupId}/todo`, todo).then((res) => res.data);
  },

  updateTodo: (groupId: number, todoId: number, todo: ITodo): Promise<ITodo> => {
    return axios.put<ITodo>(`/api/v1/group/${groupId}/todo/${todoId}`, todo).then((res) => res.data);
  },

  deleteTodo: (groupId: number, todoId: number): Promise<void> => {
    return axios.delete(`/api/v1/group/${groupId}/todo/${todoId}`);
  },
};

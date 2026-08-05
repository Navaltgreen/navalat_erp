import { dataApi } from "../../config/axios/dataApi";
import { mapTodoResponseToModel } from "../../types/dashboard/todo.mapper";
import type { ApiResponse } from "../../types/common/api";
import type { TodoModel } from "../../types/dashboard/todo.model";
import type { TodoResponse } from "../../types/dashboard/todo.response";

type GetTodosParams = {
  userId?: number;
};

export async function getTodos(params?: GetTodosParams): Promise<TodoModel[]> {
  const response = await dataApi.get<ApiResponse<TodoResponse[]>>("todos", {
    params,
  });

  if (!response.data.data) {
    return [];
  }

  return response.data.data.map(mapTodoResponseToModel);
}

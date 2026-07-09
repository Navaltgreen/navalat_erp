import type { TodoModel } from "./todo.model";
import type { TodoResponse } from "./todo.response";

export const mapTodoResponseToModel = (response: TodoResponse): TodoModel => ({
  userId: response.userId,
  id: response.id,
  title: response.title,
  completed: response.completed,
});

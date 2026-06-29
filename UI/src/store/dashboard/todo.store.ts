import { create } from "zustand";
import type { ApiError } from "../../types/common/api";
import type { TodoItem } from "../../types/dashboard/todo";

interface TodoStoreState {
  data: TodoItem[];
  error: ApiError | null;
  searchTerm: string;
  selectedUserId: number | null;
  completedOnly: boolean;
  setData: (todos: TodoItem[]) => void;
  setError: (error: ApiError | null) => void;
  resetData: () => void;
  setSearchTerm: (searchTerm: string) => void;
  setSelectedUserId: (selectedUserId: number | null) => void;
  setCompletedOnly: (completedOnly: boolean) => void;
}

export const useTodoStore = create<TodoStoreState>((set) => ({
  data: [],
  error: null,
  searchTerm: "",
  selectedUserId: null,
  completedOnly: false,
  setData: (data) => set({ data, error: null }),
  setError: (error) => set({ error, data: [] }),
  resetData: () => set({ data: [], error: null }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
  setCompletedOnly: (completedOnly) => set({ completedOnly }),
}));

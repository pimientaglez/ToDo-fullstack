import type { Todo, CreateTodoDto, UpdateTodoDto, ApiResponse } from '@/types/todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          data: data.data,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // Get all todos
  async getTodos(): Promise<ApiResponse<Todo[]>> {
    return this.request<Todo[]>('/api/todos');
  }

  // Get a single todo by ID
  async getTodo(id: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/api/todos/${id}`);
  }

  // Create a new todo
  async createTodo(todo: CreateTodoDto): Promise<ApiResponse<Todo>> {
    return this.request<Todo>('/api/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  }

  // Update a todo
  async updateTodo(
    id: string,
    updates: UpdateTodoDto
  ): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // Toggle todo completion
  async toggleTodoCompletion(id: string, isCompleted: boolean): Promise<ApiResponse<Todo>> {
    return this.updateTodo(id, { isCompleted });
  }
}

export const api = new ApiService(API_BASE_URL);

export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  _id: string;
  title: string;
  body: string;
  isCompleted: boolean;
  createDate: string;
  completeDate?: string;
  updatedDate: string;
  priority: Priority;
}

export interface CreateTodoDto {
  title: string;
  body: string;
  priority?: Priority;
}

export interface UpdateTodoDto {
  title?: string;
  body?: string;
  isCompleted?: boolean;
  priority?: Priority;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: {
    data: T;
  };
  message?: string;
}

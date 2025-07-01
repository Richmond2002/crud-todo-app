import { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from '../types/todo';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message: string, public status: number, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.error || 'An error occurred',
      response.status,
      data.details
    );
  }
  
  return data;
};

export const todoApi = {
  // Get all todos
  async getAllTodos(): Promise<ApiResponse<Todo[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      return handleResponse<ApiResponse<Todo[]>>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please ensure the backend is running on port 3001.');
      }
      throw error;
    }
  },

  // Get single todo
  async getTodo(id: number): Promise<ApiResponse<Todo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`);
      return handleResponse<ApiResponse<Todo>>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please ensure the backend is running on port 3001.');
      }
      throw error;
    }
  },

  // Create new todo
  async createTodo(todo: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      return handleResponse<ApiResponse<Todo>>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please ensure the backend is running on port 3001.');
      }
      throw error;
    }
  },

  // Update todo
  async updateTodo(id: number, todo: UpdateTodoRequest): Promise<ApiResponse<Todo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      return handleResponse<ApiResponse<Todo>>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please ensure the backend is running on port 3001.');
      }
      throw error;
    }
  },

  // Toggle todo completion
  async toggleTodo(id: number): Promise<ApiResponse<Todo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
        method: 'PATCH',
      });
      return handleResponse<ApiResponse<Todo>>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please ensure the backend is running on port 3001.');
      }
      throw error;
    }
  },

  // Delete todo
  async deleteTodo(id: number): Promise<ApiResponse<Todo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<ApiResponse<Todo>>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please ensure the backend is running on port 3001.');
      }
      throw error;
    }
  },
};
import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { todoApi } from '../services/api';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (todo: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: number, todo: UpdateTodoRequest) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTodos = useCallback(async () => {
    try {
      setError(null);
      const response = await todoApi.getAllTodos();
      setTodos(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (todoData: CreateTodoRequest) => {
    try {
      setError(null);
      const response = await todoApi.createTodo(todoData);
      if (response.data) {
        setTodos(prev => [response.data!, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id: number, todoData: UpdateTodoRequest) => {
    try {
      setError(null);
      const response = await todoApi.updateTodo(id, todoData);
      if (response.data) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? response.data! : todo
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  }, []);

  const toggleTodo = useCallback(async (id: number) => {
    try {
      setError(null);
      // Optimistic update
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
      
      const response = await todoApi.toggleTodo(id);
      if (response.data) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? response.data! : todo
        ));
      }
    } catch (err) {
      // Revert optimistic update on error
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      setError(null);
      // Optimistic update
      const todoToDelete = todos.find(todo => todo.id === id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      
      await todoApi.deleteTodo(id);
    } catch (err) {
      // Revert optimistic update on error
      await refreshTodos();
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  }, [todos, refreshTodos]);

  useEffect(() => {
    refreshTodos();
  }, [refreshTodos]);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos,
  };
};
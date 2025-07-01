import React, { useState } from 'react';
import { CheckSquare, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { Todo } from './types/todo';

function App() {
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos
  } = useTodos();

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateTodo = async (todoData: any) => {
    await createTodo(todoData);
    setShowForm(false);
  };

  const handleUpdateTodo = async (todoData: any) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">TodoMaster</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize your tasks efficiently with our beautiful and intuitive todo application.
            Create, edit, and track your progress with ease.
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={refreshTodos}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="Retry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTodo(null);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Hide Form' : 'Add New Todo'}
          </button>
        </div>

        {/* Todo Form */}
        {(showForm || editingTodo) && (
          <div className="mb-8">
            <TodoForm
              todo={editingTodo || undefined}
              onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
              onCancel={editingTodo ? handleCancelEdit : () => setShowForm(false)}
            />
          </div>
        )}

        {/* Todo List */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onEdit={handleEditTodo}
          onDelete={deleteTodo}
        />

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2025 TodoMaster. Built with React, Node.js, and modern web technologies.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
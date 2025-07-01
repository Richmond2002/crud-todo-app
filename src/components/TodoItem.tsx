import React, { useState } from 'react';
import { Check, Edit3, Trash2, Clock, AlertCircle } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(todo.id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        setIsDeleting(false);
      }
    }
  };

  const getPriorityIcon = () => {
    switch (todo.priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor()} border-r border-t border-b border-gray-100 p-6 transition-all duration-200 hover:shadow-md ${
        todo.completed ? 'opacity-75' : ''
      } ${isDeleting ? 'opacity-50 scale-95' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          } ${isToggling ? 'opacity-50' : 'hover:scale-110'}`}
        >
          {isToggling ? (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : todo.completed ? (
            <Check className="w-4 h-4" />
          ) : null}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3
                className={`text-lg font-semibold transition-all duration-200 ${
                  todo.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-800'
                }`}
              >
                {todo.title}
              </h3>
              
              {todo.description && (
                <p
                  className={`mt-2 text-sm transition-all duration-200 ${
                    todo.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {todo.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(todo)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                title="Edit todo"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                title="Delete todo"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Meta information */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {getPriorityIcon()}
              <span className="text-xs text-gray-500 capitalize font-medium">
                {todo.priority} Priority
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              {todo.updated_at !== todo.created_at ? 'Updated' : 'Created'}{' '}
              {formatDate(todo.updated_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
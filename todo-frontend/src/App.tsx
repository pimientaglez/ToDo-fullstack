import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { Todo, Priority } from './types/todo';
import { api } from './services/api';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoItem } from './components/TodoItem';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Select } from './components/ui/select';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    const response = await api.getTodos();

    if (response.success && response.data?.data) {
      // Ensure data is an array
      const todosData = Array.isArray(response.data?.data) ? response.data?.data : [];
      setTodos(todosData);
    } else {
      setError(response.message || 'Failed to fetch todos');
      setTodos([]);
    }
    setLoading(false);
  };

  const handleAddTodo = async (title: string, body: string, priority: Priority) => {
    const response = await api.createTodo({ title, body, priority });

    if (response.success && response.data?.data) {
      setTodos([response.data?.data, ...todos]);
    } else {
      setError(response.message || 'Failed to create todo');
    }
  };

  const handleToggleTodo = async (id: string, isCompleted: boolean) => {
    const response = await api.toggleTodoCompletion(id, isCompleted);

    if (response.success && response.data?.data) {
      setTodos(todos.map((todo) => (todo._id === id ? response.data?.data! : todo)));
    } else {
      setError(response.message || 'Failed to update todo');
    }
  };

  const handleUpdateTodo = async (
    id: string,
    title: string,
    body: string,
    priority: Priority
  ) => {
    const response = await api.updateTodo(id, { title, body, priority });

    if (response.success && response.data?.data) {
      setTodos(todos.map((todo) => (todo._id === id ? response.data?.data! : todo)));
    } else {
      setError(response.message || 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const response = await api.deleteTodo(id);

    if (response.success) {
      setTodos(todos.filter((todo) => todo._id !== id));
    } else {
      setError(response.message || 'Failed to delete todo');
    }
  };

  // Filter todos
  const todosList = Array.isArray(todos) ? todos : [];
  const filteredTodos = todosList.filter((todo) => {
    const statusMatch =
      filter === 'all' ||
      (filter === 'active' && !todo.isCompleted) ||
      (filter === 'completed' && todo.isCompleted);

    const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  const stats = {
    total: todosList.length,
    active: todosList.filter((t) => !t.isCompleted).length,
    completed: todosList.filter((t) => t.isCompleted).length,
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Todo App</h1>
          <p className="text-muted-foreground">
            Manage your tasks efficiently with our todo application
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-3xl">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">{stats.completed}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Add Todo Form */}
        <AddTodoForm onAdd={handleAddTodo} />

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2 flex-1">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className="flex-1"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilter('active')}
                  className="flex-1"
                >
                  Active
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilter('completed')}
                  className="flex-1"
                >
                  Completed
                </Button>
              </div>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'all' | Priority)}
                className="sm:w-48"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setError(null)}
                  className="ml-auto"
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todo List */}
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading todos...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredTodos.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">No todos found</p>
                <p className="text-sm text-muted-foreground">
                  {filter === 'all'
                    ? 'Add a new todo to get started'
                    : `No ${filter} todos`}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggleTodo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

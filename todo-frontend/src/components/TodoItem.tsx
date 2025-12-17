import { useState } from 'react';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import type { Todo, Priority } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, isCompleted: boolean) => void;
  onUpdate: (id: string, title: string, body: string, priority: Priority) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editBody, setEditBody] = useState(todo.body);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);

  const handleSave = () => {
    if (editTitle.trim() && editBody.trim()) {
      onUpdate(todo._id, editTitle, editBody, editPriority);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditBody(todo.body);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'border-l-blue-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500',
  };

  return (
    <Card className={cn('border-l-4', priorityColors[todo.priority])}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="font-medium"
            />
            <Input
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              placeholder="Description"
            />
            <Select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={todo.isCompleted}
                onChange={(e) => onToggle(todo._id, e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <h3
                  className={cn(
                    'font-medium text-lg',
                    todo.isCompleted && 'line-through text-muted-foreground'
                  )}
                >
                  {todo.title}
                </h3>
                <p
                  className={cn(
                    'text-sm text-muted-foreground mt-1',
                    todo.isCompleted && 'line-through'
                  )}
                >
                  {todo.body}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="capitalize">Priority: {todo.priority}</span>
                  <span>
                    Created: {new Date(todo.createDate).toLocaleDateString()}
                  </span>
                  {todo.completeDate && (
                    <span>
                      Completed: {new Date(todo.completeDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(todo._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

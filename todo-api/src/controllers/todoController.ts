import { Request, Response } from 'express';
import Todo from '../models/Todo';

// Create a new todo
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, body, priority } = req.body;

    if (!title || !body) {
      res.status(400).json({
        success: false,
        message: 'Title and body are required'
      });
      return;
    }

    const todo = new Todo({
      title,
      body,
      priority: priority || 'medium'
    });

    const savedTodo = await todo.save();
    res.status(201).json({
      success: true,
      data: savedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all todos
export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { completed, priority, sortBy = 'createDate', order = 'desc' } = req.query;

    // Build filter object
    const filter: any = {};
    if (completed !== undefined) {
      filter.isCompleted = completed === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort: any = { [sortBy as string]: sortOrder };

    const todos = await Todo.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a single todo by ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update a todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating createDate
    delete updates.createDate;

    const todo = await Todo.findByIdAndUpdate(
      id,
      { ...updates, updatedDate: new Date() },
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete a todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

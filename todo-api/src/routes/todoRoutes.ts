import { Router } from 'express';
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} from '../controllers/todoController';

const router = Router();

// POST /api/todos - Create a new todo
router.post('/', createTodo);

// GET /api/todos - Get all todos (with optional query params for filtering)
router.get('/', getAllTodos);

// GET /api/todos/:id - Get a single todo by ID
router.get('/:id', getTodoById);

// PUT /api/todos/:id - Update a todo
router.put('/:id', updateTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', deleteTodo);

export default router;

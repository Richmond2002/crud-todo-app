import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { pool } from '../database/init.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM todos 
      ORDER BY 
        CASE priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END,
        created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      error: 'Failed to fetch todos',
      message: error.message
    });
  }
});

// GET /api/todos/:id - Get single todo
router.get('/:id', 
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM todos WHERE id = $1',
        [req.params.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Todo not found',
          message: `Todo with ID ${req.params.id} does not exist`
        });
      }
      
      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({
        error: 'Failed to fetch todo',
        message: error.message
      });
    }
  }
);

// POST /api/todos - Create new todo
router.post('/',
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title is required and must be between 1-200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description = '', priority = 'medium' } = req.body;
      
      const result = await pool.query(
        `INSERT INTO todos (title, description, priority) 
         VALUES ($1, $2, $3) RETURNING *`,
        [title, description, priority]
      );
      
      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({
        error: 'Failed to create todo',
        message: error.message
      });
    }
  }
);

// PUT /api/todos/:id - Update todo
router.put('/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title is required and must be between 1-200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean value')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description = '', priority = 'medium', completed = false } = req.body;
      
      const result = await pool.query(
        `UPDATE todos 
         SET title = $1, description = $2, priority = $3, completed = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 RETURNING *`,
        [title, description, priority, completed, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Todo not found',
          message: `Todo with ID ${id} does not exist`
        });
      }
      
      res.json({
        success: true,
        message: 'Todo updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({
        error: 'Failed to update todo',
        message: error.message
      });
    }
  }
);

// PATCH /api/todos/:id/toggle - Toggle todo completion
router.patch('/:id/toggle',
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        `UPDATE todos 
         SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Todo not found',
          message: `Todo with ID ${id} does not exist`
        });
      }
      
      const updatedTodo = result.rows[0];
      
      res.json({
        success: true,
        message: `Todo ${updatedTodo.completed ? 'completed' : 'uncompleted'} successfully`,
        data: updatedTodo
      });
    } catch (error) {
      console.error('Error toggling todo:', error);
      res.status(500).json({
        error: 'Failed to toggle todo',
        message: error.message
      });
    }
  }
);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id',
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'DELETE FROM todos WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Todo not found',
          message: `Todo with ID ${id} does not exist`
        });
      }
      
      res.json({
        success: true,
        message: 'Todo deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({
        error: 'Failed to delete todo',
        message: error.message
      });
    }
  }
);

export default router;
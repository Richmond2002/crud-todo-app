import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'todo_app',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

export const initDatabase = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Create todos table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create an index on created_at for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC)
    `);

    // Create an index on priority for better filtering performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority)
    `);

    // Insert sample data for development (only if table is empty)
    const { rows } = await client.query('SELECT COUNT(*) FROM todos');
    const todoCount = parseInt(rows[0].count);

    if (todoCount === 0) {
      const sampleTodos = [
        {
          title: 'Complete project documentation',
          description: 'Write comprehensive documentation for the CRUD Todo application',
          priority: 'high',
          completed: false
        },
        {
          title: 'Review code quality',
          description: 'Perform code review and refactoring for better maintainability',
          priority: 'medium',
          completed: false
        },
        {
          title: 'Setup CI/CD pipeline',
          description: 'Configure continuous integration and deployment workflow',
          priority: 'low',
          completed: true
        }
      ];

      for (const todo of sampleTodos) {
        await client.query(
          `INSERT INTO todos (title, description, priority, completed) 
           VALUES ($1, $2, $3, $4)`,
          [todo.title, todo.description, todo.priority, todo.completed]
        );
      }
      console.log('✅ Sample data inserted');
    }

    client.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.error('Please ensure PostgreSQL is running and your database credentials are correct.');
    console.error('Check the README.md file for database setup instructions.');
    throw error;
  }
};

// Export the pool for use in other modules
export { pool };
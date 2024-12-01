import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: 'localhost',
  user: 'db_user',
  password: 'pass',
  database: 'furniture_inventory'
});
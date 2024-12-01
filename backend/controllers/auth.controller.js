import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import 'dotenv/config';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0)
      return res.status(400).json({
        message: ["El correo no existe"],
      });

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Autenticación exitosa', token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
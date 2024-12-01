import express from 'express';
import cors from 'cors';
import jwt from'jsonwebtoken';

import userRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import materialRoutes from './routes/materials.routes.js';
import productRoutes from './routes/finishedProducts.routes.js';

import { PORT } from './config.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", materialRoutes);
app.use("/api", productRoutes);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  });
};

// GET - Obtener inventario
app.get('/api/inventory', authenticateToken, (req, res) => {
  db.query('SELECT * FROM inventory', (err, results) => {
    if (err) {
      console.error('Error al obtener el inventario:', err);
      res.status(500).json({ 
        error: 'Error al obtener el inventario',
        details: err.message 
      });
    } else {
      res.json(results);
    }
  });
});

// POST - Insertar nuevo item
app.post('/api/inventory', (req, res) => {
  const { name, quantity, type, threshold } = req.body;

  // Validación de campos
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({ error: 'La cantidad debe ser un número válido' });
  }

  // Convertir valores a los tipos correctos
  const parsedQuantity = parseInt(quantity, 10);
  const parsedThreshold = threshold ? parseInt(threshold, 10) : 0;
  const parsedType = type || '';

  db.query(
    'INSERT INTO inventory (name, quantity, type, threshold) VALUES (?, ?, ?, ?)', 
    [name, parsedQuantity, parsedType, parsedThreshold],
    (err, results) => {
      if (err) {
        console.error('Error al insertar datos:', err);
        res.status(500).json({ 
          error: 'Error al insertar datos',
          details: err.message 
        });
        return;
      }
      res.status(201).json({ 
        message: 'Datos insertados correctamente',
        id: results.insertId 
      });
    }
  );
});

// PUT - Actualizar item
app.put('/api/inventory/:id', (req, res) => {
  const { name, quantity, type, threshold } = req.body;
  const id = req.params.id;

  // Validación de campos
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({ error: 'La cantidad debe ser un número válido' });
  }

  const parsedQuantity = parseInt(quantity, 10);
  const parsedThreshold = threshold ? parseInt(threshold, 10) : 0;
  const parsedType = type || '';

  db.query(
    'UPDATE inventory SET name = ?, quantity = ?, type = ?, threshold = ? WHERE id = ?', 
    [name, parsedQuantity, parsedType, parsedThreshold, id],
    (err, results) => {
      if (err) {
        console.error('Error al editar datos:', err);
        res.status(500).json({ 
          error: 'Error al editar datos',
          details: err.message 
        });
        return;
      }
      
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Item no encontrado' });
        return;
      }
      
      res.json({ message: 'Datos editados correctamente' });
    }
  );
});

// PUT - Ajustar cantidad
app.put('/api/inventory/quantity/:id', (req, res) => {
  const { quantity } = req.body;
  const id = req.params.id;

  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({ error: 'La cantidad debe ser un número válido' });
  }

  const parsedQuantity = parseInt(quantity, 10);

  db.query(
    'UPDATE inventory SET quantity = ? WHERE id = ?', 
    [parsedQuantity, id],
    (err, results) => {
      if (err) {
        console.error('Error al ajustar cantidad:', err);
        res.status(500).json({ 
          error: 'Error al ajustar cantidad',
          details: err.message 
        });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Item no encontrado' });
        return;
      }

      res.json({ message: 'Cantidad ajustada correctamente' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
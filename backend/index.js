const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'db_user',
  password: 'pass',
  database: 'furniture_inventory'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

// GET - Obtener inventario
app.get('/api/inventory', (req, res) => {
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
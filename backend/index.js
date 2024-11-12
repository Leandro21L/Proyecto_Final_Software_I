const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Configura la conexión a MySQL
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

// Ejemplo de endpoin
app.get('/api/inventory', (req, res) => {
  db.query('SELECT * FROM inventory', (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener el inventario');
    } else {
      res.json(results);
    }
  });
});

//Inserta nuevo registro en la db
app.post('/api/inventory', (req, res) => {
  const data = req.body;
  db.query('INSERT INTO inventory (name, quantity, type, threshold) VALUES (?, ?, ?, ?)', 
    [data.name, data.quantity, data.type, data.threshold],
    (err, results) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      res.status(500).send('Error al insertar datos');
      return;
    }
    res.status(201).send('Datos insertados correctamente');
  });
});

//Actualiza/editar registro por id
app.put('/api/inventory/:id', (req, res) => {
  const data = req.body;
  const id = req.params.id;
  db.query('UPDATE inventory SET name = ?, quantity = ?, type = ?, threshold = ? WHERE id = ?', 
    [data.name, data.quantity, data.type, data.threshold, id],
    (err, results) => {
    if (err) {
      console.error('Error al editar datos:', err);
      res.status(500).send('Error al editar datos');
      return;
    }
    res.status(201).send('Datos editados correctamente');
  });
});

//Ajuste manual de cantidad
app.put('/api/inventory/quantity/:id', (req, res) => {
  const data = req.body;
  const id = req.params.id;
  db.query('UPDATE inventory SET quantity = ? WHERE id = ?', 
    [data.quantity, id],
    (err, results) => {
    if (err) {
      console.error('Error al editar datos:', err);
      res.status(500).send('Error al editar datos');
      return;
    }
    res.status(201).send('Datos editados correctamente');
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
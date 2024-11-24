const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// POST - Registro
app.post('/api/register', async (req, res) => {
  const { doc_number, name, last_name, user_type, email, password } = req.body;

  console.log('Datos recibidos:', { 
    doc_number, 
    name, 
    last_name, 
    user_type, 
    email,
    passwordLength: password ? password.length : 0 
  });

  try {
    // Validar campos obligatorios
    if (!doc_number || !name || !last_name || !user_type || !email || !password) {
      console.log('Campos faltantes:', {
        doc_number: !doc_number,
        name: !name,
        last_name: !last_name,
        user_type: !user_type,
        email: !email,
        password: !password
      });
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el email ya existe
    const [existingUsers] = await promiseDb.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log('Email duplicado:', email);
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Contraseña hasheada exitosamente');

    // Insertar usuario en la base de datos
    const [result] = await promiseDb.query(
      `INSERT INTO users (doc_number, name, last_name, user_type, email, password) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [doc_number, name, last_name, user_type, email, hashedPassword]
    );

    console.log('Usuario insertado exitosamente:', result.insertId);

    res.status(201).json({ 
      message: 'Usuario registrado correctamente', 
      id: result.insertId 
    });

  } catch (error) {
    console.error('Error detallado al registrar usuario:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlMessage: error.sqlMessage
    });

    res.status(500).json({ 
      error: 'Error al registrar el usuario',
      details: error.message
    });
  }
});

// POST - Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error al autenticar usuario:', err);
      return res.status(500).json({ error: 'Error al autenticar usuario' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Autenticación exitosa', token });
  });
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  });
};


// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'db_user',
  password: 'pass',
  database: 'furniture_inventory'
});

const promiseDb = db.promise();

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});



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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
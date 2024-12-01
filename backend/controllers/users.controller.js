import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
    const { doc_number, name, last_name, email, password, id_rol } = req.body;

    console.log('Datos recibidos:', {
        doc_number,
        name,
        last_name,
        email,
        passwordLength: password ? password.length : 0,
        id_rol: id_rol
    });

    try {
        // Validar campos obligatorios
        if (!doc_number || !name || !last_name || !email || !password || !id_rol) {
            console.log('Campos faltantes:', {
                doc_number: !doc_number,
                name: !name,
                last_name: !last_name,
                email: !email,
                password: !password,
                id_rol: !id_rol
            });
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si el email ya existe
        const [existingUsers] = await pool.query(
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
        const [result] = await pool.query(
            `INSERT INTO users (doc_number, name, last_name, email, password, id_rol) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [doc_number, name, last_name, email, hashedPassword, id_rol]
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
};

export const getUsers = async (req, res) => {
    res.send('obteniendo usuarios');
    /*try {
        const [result] = await pool.query(
            'SELECT * FROM users ORDER BY id_rol ASC'
        );
        res.json(result);
    } catch (error) {
        
    }*/
};

export const getUser = (req, res) => {
    res.send('obteniendo usuario')
};

export const updateUser = (req, res) => {
    res.send('actualizando usuario')
};

export const deleteUser = (req, res) => {
    res.send('eliminando usuario')
};

export const getRoles = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT id, name FROM roles');
        res.json(result);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return res.status(500).json({
            error: 'Error al obtener roles',
            details: error.message
        });
    };
}
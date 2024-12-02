import { pool } from '../db.js'

export const getMovements = async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT * FROM inventory_movements'
        );
        res.json(results);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createMovement = async (req, res) => {
    try {
        const {id_material, id_product, movement_type, quantity, description, id_usuario} = req.body;
        const [result] = await pool.query(
            'INSERT INTO inventory_movements (id_material, id_product, movement_type, quantity, description, id_usuario) VALUES (?,?,?,?,?,?)', [
            id_material,
            id_product,
            movement_type,
            quantity,
            description,
            id_usuario
        ]);
        res.json({
            id: result.insertId,
            id_material,
            id_product,
            movement_type,
            quantity, 
            description,
            id_usuario
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
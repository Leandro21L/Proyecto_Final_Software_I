import { pool } from "../db.js";

export const createMaterial = async (req, res) => {
    const { name, description, current_quantity, min_quantity, max_quantity, measurement_unit } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO raw_materials(name, description, current_quantity, min_quantity, max_quantity, measurement_unit) 
                VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, current_quantity, min_quantity, max_quantity, measurement_unit]
        );
        res.json({
            id: result.insertId,
            name, 
            description, 
            current_quantity, 
            min_quantity, 
            max_quantity, 
            measurement_unit
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getMaterials = (req, res) => {
    res.send('obteniendo materiales');
};

export const getMaterial = (req, res) => {
    res.send('obteniendo material');
};

export const updateMaterial = (req, res) => {
    res.send('actualizando material');
}

export const deleteMaterial = (req, res) => {
    res.send('eliminando material');
}
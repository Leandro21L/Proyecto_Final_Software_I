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

export const getMaterials = async (req, res) => {
        try {
            const [products] = await pool.query(
                'SELECT * FROM raw_materials'
            );
            res.json(products);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
};

export const getMaterial = (req, res) => {
    res.send('obteniendo material');
};

export const updateMaterial = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE raw_materials SET ? WHERE id = ?', [
            req.body,
            req.params.id
        ]);
        res.json(result);
    } catch (error) {
       return res.status(500).json({message: error.message}); 
    }
};

export const deleteMaterial = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM raw_materials WHERE id  = ?', [
                req.params.id
        ]);

        if (result.affectedRows === 0)
            return res.status(404).json({message: "Producto no encontrado"});

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};
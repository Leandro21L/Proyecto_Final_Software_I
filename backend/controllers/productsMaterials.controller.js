import { pool } from '../db.js';

export const getData = async (req, res) =>{
    try {
        const [results] = await pool.query(
            'SELECT * FROM products_materials'
        );
        res.json(results);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const productsMaterials = async (req, res) => {
    try {
        const { id_material, id_product, materials_used } = req.body;
        const [result] = await pool.query('INSERT INTO products_materials VALUES (?, ?, ?)',
            [id_material, id_product, materials_used]
        );
        res.json({
            id_material,
            id_product,
            materials_used
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

export const searchByMaterial = async (req, res) => {
    try {
        const [materials] = await pool.query(
            'SELECT * FROM products_materials WHERE id_material = ?', [
                req.params.id
        ]);
        res.json(materials);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const searchByProduct = async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT * FROM products_materials WHERE id_product = ?', [
                req.params.id
        ]);
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
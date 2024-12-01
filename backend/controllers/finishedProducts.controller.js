import { pool } from "../db.js";

export const createProduct = async (req, res) => {
    const { name, description, current_quantity, min_quantity, max_quantity } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO finished_products(name, description, current_quantity, min_quantity, max_quantity) 
                VALUES (?, ?, ?, ?, ?)`,
            [name, description, current_quantity, min_quantity, max_quantity]
        );
        res.json({
            id: result.insertId,
            name, 
            description, 
            current_quantity, 
            min_quantity, 
            max_quantity
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getProducts = (req, res) => {
    res.send('obteniendo productos');
};

export const getProduct = (req, res) => {
    res.send('obteniendo producto');
};

export const updateProduct = (req, res) => {
    res.send('actualizando producto');
}

export const deleteProduct = (req, res) => {
    res.send('eliminando producto');
}
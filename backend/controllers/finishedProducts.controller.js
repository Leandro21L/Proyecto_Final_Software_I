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

export const getProducts = async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT * FROM finished_products'
        );
        res.json(products);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getProduct = (req, res) => {
    res.send('obteniendo producto');
};

export const updateProduct = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE finished_products SET ? WHERE id = ?', [
            req.body,
            req.params.id
        ]);
        res.json(result);
    } catch (error) {
       return res.status(500).json({message: error.message}); 
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM finished_products WHERE id  = ?', [
                req.params.id
        ]);

        if (result.affectedRows === 0)
            return res.status(404).json({message: "Producto no encontrado"});

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};
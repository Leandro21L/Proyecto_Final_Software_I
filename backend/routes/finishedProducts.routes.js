import express from 'express';
const router = express.Router();
import {
    createProduct, 
    getProducts, 
    getProduct, 
    updateProduct, 
    deleteProduct
} from '../controllers/finishedProducts.controller.js';

router.post('/products/create', createProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
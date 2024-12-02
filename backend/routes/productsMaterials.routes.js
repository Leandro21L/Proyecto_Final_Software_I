import express from 'express';
import {
    productsMaterials,
    searchByMaterial, 
    searchByProduct
} from '../controllers/productsMaterials.controller.js';

const router = express.Router();

router.post('/products-materials/create', productsMaterials);
router.get('/products-materials/material/:id', searchByMaterial);
router.get('/products-materials/product/:id', searchByProduct);

export default router;
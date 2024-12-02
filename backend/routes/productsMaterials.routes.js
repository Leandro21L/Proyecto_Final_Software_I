import express from 'express';
import {
    getData,
    productsMaterials,
    searchByMaterial, 
    searchByProduct
} from '../controllers/productsMaterials.controller.js';

const router = express.Router();

router.post('/products-materials/create', productsMaterials);
router.get('/products-materials/material/:id', searchByMaterial);
router.get('/products-materials/product/:id', searchByProduct);
router.get('/products-materials', getData);

export default router;
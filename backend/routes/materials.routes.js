import express from 'express';
const router = express.Router();
import {
    createMaterial, 
    getMaterials, 
    getMaterial, 
    updateMaterial, 
    deleteMaterial
} from '../controllers/rawMaterials.controller.js';

router.post('/materials/create', createMaterial);
router.get('/materials', getMaterials);
router.get('/materials/:id', getMaterial);
router.put('/materials/:id', updateMaterial);
router.delete('/materials/:id', deleteMaterial);

export default router;
import express from 'express';
const router = express.Router();
import {
    createMaterial, 
    getMaterials, 
    getMaterial, 
    updateMaterial, 
    deleteMaterial
} from '../controllers/rawMaterials.controller.js';

router.post('/Material/create', createMaterial);
router.get('/Material', getMaterials);
router.get('/Material/:id', getMaterial);
router.put('/Material/:id', updateMaterial);
router.delete('/Material/:id', deleteMaterial);

export default router;
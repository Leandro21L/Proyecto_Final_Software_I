import express from 'express';
const router = express.Router();
import {
    createMaterial, 
    getMaterials, 
    getMaterial,
    updateMaterial, 
    deleteMaterial
} from '../controllers/rawMaterials.controller.js';

router.post('/Materials/create', createMaterial);
router.get('/Materials', getMaterials);
router.get('/Materials/:id', getMaterial);
router.put('/Materials/:id', updateMaterial);
router.delete('/Materials/:id', deleteMaterial);

export default router;
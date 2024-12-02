import { Router } from "express";
import { 
    createMovement,
    getMovements
} from "../controllers/inventory.controller.js";

const router = Router();

router.post('/inventory/movement', createMovement);
router.get('/inventory', getMovements);

export default router;
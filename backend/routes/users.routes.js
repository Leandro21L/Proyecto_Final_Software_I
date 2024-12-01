import express from 'express';
const router = express.Router();
import {
    createUser, 
    getUsers, 
    getUser, 
    updateUser, 
    deleteUser
} from '../controllers/users.controller.js';

router.post('/users/register', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
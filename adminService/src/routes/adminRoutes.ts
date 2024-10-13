import { Router } from 'express';
import { createUser, getUsers , updateUser, deleteUser} from '../controllers/adminController';
import { authenticateJWT, isAdmin } from '../middlewares/authMiddleware';
const router = Router();

// POST /api/register
router.post('/users',authenticateJWT,isAdmin,  createUser);

// router.post('/login', loginUser);

router.get('/users', authenticateJWT,isAdmin, getUsers);

router.put('/users/:id', authenticateJWT,isAdmin, updateUser);

router.delete('/users/:id', authenticateJWT,isAdmin, deleteUser);
export default router;

import { Router } from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';
const router = Router();

// POST /api/register
router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateJWT, getProfile);

export default router;

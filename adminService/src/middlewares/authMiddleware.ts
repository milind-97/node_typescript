import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Use the same secret key from registration/login
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

interface DecodedToken {
    id: string;
    email: string;
    role: string;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      
        res.status(401).json({status: false, message: 'Please login to access this resource' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      
        (req as any).user = decoded;
        next(); 
    } catch (error) {
        res.status(401).json({status: false, message: 'Please login to access this resource' });
    }
};


export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;

  if (user.role !== 'admin') {
       res.status(403).json({status: false, message: 'Access denied. Only Admin can access this resource.' });
       return
  }

  next();
};

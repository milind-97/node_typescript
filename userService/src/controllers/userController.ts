import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Error as MongooseError } from 'mongoose';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name) {
        res.status(400).json({status: false, message: 'Name is required' });
        return;
    }
    if (!email) {
      res.status(400).json({status: false, message: 'Email is required' });
      return;
  }
  if (!password) {
    res.status(400).json({status: false, message:'Password is required' });
    return;
}

    try {
        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({status: true, message: 'Email already in use' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser: IUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({status: true, message: 'User registered successfully' });
        return
    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
          const errors: string[] = [];
          for (const key in error.errors) {
              errors.push(error.errors[key].message);
          }
           res.status(400).json({status: false, message:errors[0] });
           return
      }
  
      // Handle Mongoose duplicate key error (email)
      if ((error as any).code === 11000 && (error as any).keyPattern && (error as any).keyPattern.email) {
           res.status(400).json({status: false, message: 'Email is already in use' });
           return
      }
      res.status(500).json({status: false, message: 'Internal server error' });
      return
      }
};



export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
      res.status(400).json({status: false, message: 'Email and password are required' });
      return;
  }

  try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
          res.status(400).json({ status: false, message: 'Invalid email' });
          return;
      }

      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          res.status(400).json({status: false, message: 'Invalid password' });
          return;
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

      // Respond with the token
      res.status(200).json({status: true, token });
    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
          const errors: string[] = [];
          for (const key in error.errors) {
              errors.push(error.errors[key].message);
          }
           res.status(400).json({status: false, message:errors[0] });
           return
      }
  
      // Handle Mongoose duplicate key error (email)
      if ((error as any).code === 11000 && (error as any).keyPattern && (error as any).keyPattern.email) {
           res.status(400).json({ error: 'Email is already in use' });
           return
      }
      }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
// console.log(userId)
        const user = await User.findOne({_id: userId}).select('name email createdAt');
        if (!user) {
             res.status(404).json({status: false, message: 'User not found' });
             return
        }

         res.status(200).json({
            name: user.name,
            email: user.email,
            registeredAt: user.createdAt
        });
        return
    } catch (error) {
         res.status(500).json({status: false, message: 'Internal server error' });
    }
};

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import mongoose, { Error as MongooseError } from 'mongoose';
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;

    try {

        // // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();

         res.status(201).json({status: true, message: 'User created successfully', user: newUser });
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



export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, name, email, role } = req.query;

        const query: any = {}; 

        // Add filters based on query params
        if (name) {
            query.name = { $regex: name, $options: 'i' };  // Case-insensitive search for name
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };  // Case-insensitive search for email
        }
        if (role) {
            query.role = role;
        }

        // Pagination: Convert `page` and `limit` to integers
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);

        // Fetch users with pagination and filters
        const users = await User.find(query)
            .select('-password')  // Exclude password field
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * pageSize)  // Pagination logic
            .limit(pageSize);  // Limit results per page

        // Get the total count of users (for pagination)
        const totalUsers = await User.countDocuments(query);
if(totalUsers <=0){
  res.status(404).json({ status: false, message: 'No users found' });
  return
}
         res.status(200).json({
            users,
            page: pageNumber,
            totalPages: Math.ceil(totalUsers / pageSize),
            totalUsers
        });
        return
    } catch (error) {
         res.status(500).json({ error: 'Server error' });
         return
    }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, role } = req.body;
  const { id } = req.params; // User ID from request params

  try {

    // Find user and update details
    const user = await User.findOne({_id:id});
    if (!user) {
       res.status(404).json({status: false, message: 'User not found' });
       return
    }

    // Update the user details
    await user.updateOne({ name, email, role });

     res.status(200).json({status: true, message: 'User updated successfully' });
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



export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // User ID from request params

  try {
    // Check if the user exists
    const user = await User.findOne({_id:id});
    if (!user) {
       res.status(404).json({status: false, message: 'User not found' });
       return
    }
    const loginUser = (req as any).user;
    // Check if the admin is trying to delete themselves
    if (loginUser.id === user.id) {
       res.status(400).json({status: false, message: 'Admins cannot delete themselves' });
       return
    }

    // Delete the user
    await user.deleteOne();

     res.status(200).json({status: true, message: 'User deleted successfully' });
     return
    } catch (error: unknown) {
      res.status(500).json({status: false, message: 'Internal server error' });
      return
      }
};

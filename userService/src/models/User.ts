import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: 'user' | 'admin';
}

const userSchema: Schema = new Schema({
    name: { type: String, required: [true, 'Name is required'],  },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Enforcing email uniqueness
      match: [/.+\@.+\..+/, 'Please provide a valid email address'], // Email format validation
    },
    password: { type: String, required: [true, 'Password is required'], },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
    },
    role: { type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role. Role must be either "user" or "admin".', // Custom error message for invalid roles
      },
      default: 'user', }
});

export const User = model<IUser & Document>('User', userSchema);

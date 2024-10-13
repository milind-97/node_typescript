import {User} from '../src/models/User'; // Import the User model
import { Types } from 'mongoose';

// Service to fetch users who registered within the last 7 days
export const getUsersRegisteredLast7Days = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Get the date 7 days ago

    // Fetch users who registered after this date
    const users = await User.find({
      createdAt: { $gte: sevenDaysAgo },
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

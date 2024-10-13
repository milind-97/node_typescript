import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { getUsersRegisteredLast7Days } from '../services/userService';
import logRequest from './middlewares/logMiddleware';

import adminRoutes from './routes/adminRoutes';
const app: Application = express();

// Middleware
app.use(express.json());
app.use(logRequest);
// Connect to MongoDB

const connectDatabase = () => {
    // mongoose.set('strictQuery', false);
    mongoose.set('strictQuery', false)
    mongoose.connect("mongodb://mongo:27017/node_task",{
        // useNewUrlParser: true,
        // useFindAndModify: false,
        // useUnifiedTopology: true
      }).then(async(data)=>{
        console.log(`Mongodb connected with server: ${data.connection.host} `)
        try {
          const users = await getUsersRegisteredLast7Days();
          console.log(`Users registered in the last 7 days:`);
          console.table(users.map(user => ({
            id: user._id, // MongoDB's _id
            name: user.name,
            email: user.email,
            registeredAt: user.createdAt,
          })));
        } catch (error) {
          console.error('Error while logging registered users:', error);
        }
    })
}
connectDatabase()

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

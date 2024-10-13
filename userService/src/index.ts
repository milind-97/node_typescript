import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import logRequest from './middlewares/logMiddleware';
import userRoutes from './routes/userRoutes';

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
    })
}
connectDatabase()

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


app.use('/api', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

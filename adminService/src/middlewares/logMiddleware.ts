import { Request, Response, NextFunction } from 'express';

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method; // HTTP method (GET, POST, etc.)
  const endpoint = req.originalUrl; // The request URL (endpoint)
  const timestamp = new Date().toISOString(); // Current timestamp

  console.log(`[${timestamp}] ${method} ${endpoint}`); // Log the details to the console

  next(); // Pass control to the next middleware or route handler
};

export default logRequest;

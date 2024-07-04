import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { app } from './app.js';

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to MongoDB

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('MONGODB CONNECTION FAILED!!', error);
    process.exit(1);
  });

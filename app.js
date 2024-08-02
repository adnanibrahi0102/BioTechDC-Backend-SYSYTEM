import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Initialize express app
const app = express();

// Middleware setup
app.use(
  cors({
    // origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    origin: process.env.CORS_ORIGIN || 'https://biotechdc.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(cookieParser());


// Import and use routes
import patientRouter from './routes/patient.routes.js';
import testRouter from './routes/test.routes.js';
import userRouter from './routes/user.routes.js';
import reportRouter from './routes/report.routes.js'
import bookingRouter from './routes/booking.routes.js'

app.use("/api/v1/users", userRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/tests", testRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/bookings", bookingRouter);

export { app };

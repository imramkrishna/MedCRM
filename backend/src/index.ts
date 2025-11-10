import express from "express";
import cors from "cors";
import authRouter from "./routes/auth/authRoutes";
import profileRouter from "./routes/auth/profileRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/profile/adminRoutes";
import distributorRouter from "./routes/profile/distributorRoutes";
import productsRouter from "./routes/products/productsRoutes";
import { Request,Response } from "express";
import prisma from "./utils/prismaClient";
import encryptPassword from "./utils/encryptPassword";
// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Basic health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'HarmonySurgiTech API is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Middleware
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3002", // for your local dev
    "https://harmony-surgi-tech.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log('CORS blocked origin:', origin);
                callback(null, true); // Allow all for now, change to callback(new Error('Not allowed by CORS')) later
            }
        },
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200,
    })
);
// Routes
app.use("/auth", authRouter)
app.use("/profile", profileRouter);
app.use("/admin", adminRouter);
app.use("/distributor", distributorRouter);
app.use("/products", productsRouter);
app.post("/create-admin",async (req:Request,res:Response)=>{
    let {email,password}=req.body;
    let hashedPassword=await encryptPassword(password);
    await prisma.admin.create({
        data: {
            email,
            password:hashedPassword,
        }
    });
    res.status(201).json({ message: "Admin created successfully" });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET_SET: !!process.env.JWT_SECRET,
        DATABASE_URL_SET: !!process.env.DATABASE_URL
    });
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});

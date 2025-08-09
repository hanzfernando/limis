import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/database'
import logger from './middlewares/logger'
import { errorHandler } from './middlewares/errorHandler'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import vaultRoutes from './routes/vaultRoutes'
import devRoutes from './routes/devRoutes'

dotenv.config({ path: '.env.local'})
const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser());

app.use(logger)

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vaults', vaultRoutes);
app.use("/api/dev", devRoutes);

app.use(errorHandler)

connectDB()
    .then(async () => {
        app.listen(PORT, () => {
            console.log("Server running on port", PORT)
        })
    })
    .catch((error: { message: any }) => {
        console.log("Error: ", error.message);
        process.exit(1)
    })
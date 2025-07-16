import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database'
import logger from './middlewares/logger'

dotenv.config({ path: '.env.local'})
const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use(logger)

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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
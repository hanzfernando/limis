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

dotenv.config()
const PORT = process.env.PORT
const app = express()

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.EXPO_URL,
  process.env.EXPO_GO_URL,
  process.env.EXPO_GO_TUNNEL_URL,
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    console.log("CORS check for origin:", origin);
    // allow mobile apps / curl / postman (no origin)
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV !== 'production') {
      try {
        const { hostname } = new URL(origin);
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return callback(null, true);
        }
      } catch {
        // Ignore invalid origin values and continue to strict checks below.
      }
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser());

app.use(logger)

app.use(cors(corsOptions));

// Express 5 requires a named wildcard pattern for catch-all preflight.
app.options('/{*any}', cors(corsOptions)); 


app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vaults', vaultRoutes);
app.use("/api/dev", devRoutes);

app.use(errorHandler)

connectDB()
    .then(async () => {
        app.listen(Number(PORT), '0.0.0.0', () => {
          console.log("Server running on port", PORT)
        })
    })
    .catch((error: { message: any }) => {
        console.log("Error: ", error.message);
        process.exit(1)
    })
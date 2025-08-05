// routes/devRoutes.ts or any temp route file
import express from "express";
import { generateHashedPassword } from "../controllers/devController";

const router = express.Router();

router.post("/hash-password", generateHashedPassword);

export default router;

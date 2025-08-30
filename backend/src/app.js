import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import askRoutes from "./routes/askRoutes.js";

const app = express();

// middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",  // during dev: "*", prod: your frontend domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use("/upload", uploadRoutes);
app.use("/ask", askRoutes);

export default app;

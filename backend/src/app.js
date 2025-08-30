import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import askRoutes from "./routes/askRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/upload", uploadRoutes);
app.use("/ask", askRoutes);

// health check
app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

export default app;

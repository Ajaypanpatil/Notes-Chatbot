import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import askRoutes from "./routes/askRoutes.js";

const app = express();

// ✅ Allow both local dev and deployed frontend
const allowedOrigins = [
  "http://localhost:5173", // for local frontend dev
  "https://noteschatbot.vercel.app", // deployed frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ health check route (helps Render keep it alive)
app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/upload", uploadRoutes);
app.use("/ask", askRoutes);

export default app;

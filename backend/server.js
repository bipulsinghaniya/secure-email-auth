const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const authRoutes = require("./routes/auth");

const app = express();

// ── Middleware ──
app.use(express.json());
app.use(cookieParser());

// ── API Routes ──
app.use("/auth", authRoutes);

// ── Serve React Frontend (built files) ──
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all: send all non-API requests to React's index.html
app.use((req, res, next) => {
  if (req.path.startsWith("/auth")) return next();
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ── Start ──
const start = async () => {
  await connectDB();
  await redisClient.connect();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}\n`);
  });
};

start();

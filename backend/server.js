const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",   // ✅ VITE
//       "http://127.0.0.1:5500",
//       "http://localhost:5500"
//     ],
//     credentials: true
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://secure-email-auth-frontend.onrender.com"
    ],
    credentials: true
  })
);



app.use("/auth", authRoutes);

const start = async () => {
  await connectDB();
  await redisClient.connect();
  app.listen(process.env.PORT, () =>
    console.log("Server running on port", process.env.PORT)
  );
};

start();

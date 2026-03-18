const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const sendEmail = require("../utils/sendEmail");

/* ─────────────────────────────────────
   STEP 1: SIGNUP → Send OTP to email
   User is NOT created yet.
   We store { name, email, hashedPassword } + otp in Redis.
───────────────────────────────────── */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists in MongoDB
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Check if an OTP is already pending for this email
    const pending = await redisClient.get(`otp:${email}`);
    if (pending) return res.status(400).json({ message: "OTP already sent. Check your email." });

    // Hash the password now, store it temporarily
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store everything in Redis (expires in 10 minutes)
    await redisClient.set(
      `otp:${email}`,
      JSON.stringify({ name, email, hashedPassword, otp }),
      { EX: 600 }
    );

    // Send OTP via email
    await sendEmail(email, otp);

    res.json({ message: "OTP sent to your email. Please verify." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ─────────────────────────────────────
   STEP 2: VERIFY OTP → Create user
   Only NOW does the user get saved to MongoDB.
───────────────────────────────────── */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Retrieve stored data from Redis
    const data = await redisClient.get(`otp:${email}`);
    if (!data) return res.status(400).json({ message: "OTP expired or not found. Please sign up again." });

    const parsed = JSON.parse(data);

    // Compare OTP
    if (parsed.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is correct → Create the user in MongoDB
    await User.create({
      name: parsed.name,
      email: parsed.email,
      password: parsed.hashedPassword,
    });

    // Clean up Redis
    await redisClient.del(`otp:${email}`);

    res.json({ message: "Email verified! Account created. You can now login." });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};

/* ─────────────────────────────────────
   LOGIN → returns JWT in httpOnly cookie
───────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      maxAge: 3600000,
      path: "/",
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ─────────────────────────────────────
   DASHBOARD → Protected, returns user info
───────────────────────────────────── */
exports.dashboard = async (req, res) => {
  res.json({ name: req.user.name, email: req.user.email });
};

/* ─────────────────────────────────────
   LOGOUT → Clears cookie
───────────────────────────────────── */
exports.logout = async (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out" });
};

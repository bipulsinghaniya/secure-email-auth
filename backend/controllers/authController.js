// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const redisClient = require("../config/redis");
// const sendEmail = require("../utils/sendEmail");

// /* SIGNUP */
// exports.signup = async (req, res) => {
//   const { name, email, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword
//   });

//   const token = crypto.randomBytes(32).toString("hex");

//   // store verification token in redis (10 min)
//   await redisClient.set(`verify:${token}`, user._id.toString(), {
//     EX: 600
//   });

//   const link = `http://127.0.0.1:5500/frontend/verify.html?token=${token}`;
//   await sendEmail(email, link);

//   res.json({ message: "Signup successful. Check email to verify." });
// };

// /* VERIFY EMAIL */
// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   const userId = await redisClient.get(`verify:${token}`);
//   if (!userId) return res.status(400).send("Invalid or expired link");

//   await User.findByIdAndUpdate(userId, { emailVerified: true });
//   await redisClient.del(`verify:${token}`);

//   res.send("Email verified. You can now login.");
// };

// /* LOGIN */
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).send("User not found");
//   if (!user.emailVerified)
//     return res.status(401).send("Verify email first");

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(401).send("Wrong password");

//   const token = jwt.sign(
//     { id: user._id },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );

//  res.cookie("token", token, {
//   httpOnly: true,
//   sameSite: "lax",
//   secure: false,
//   maxAge: 3600000
// });


//   res.json({ message: "Login successful" });
// };

// /* DASHBOARD */
// exports.dashboard = async (req, res) => {
//   res.json({ name: req.user.name });
// };

// /* LOGOUT */
// exports.logout = async (req, res) => {
//   const token = req.cookies.token;
//   const decoded = jwt.decode(token);

//   await redisClient.set(`block:${token}`, "blocked", {
//     EX: decoded.exp - Math.floor(Date.now() / 1000)
//   });

//   res.clearCookie("token");
//   res.send("Logged out");
// };





const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const redisClient = require("../config/redis");
const sendEmail = require("../utils/sendEmail");

/* =========================
   SIGNUP
========================= */
/* =========================
   SIGNUP
========================= */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false
    });

    const verifyToken = crypto.randomBytes(32).toString("hex");

    // store token in redis for 10 minutes
    await redisClient.set(
      `verify:${verifyToken}`,
      user._id.toString(),
      { EX: 600 }
    );

    // ✅ REACT VERIFY LINK
    const link = `http://localhost:5173/verify?token=${verifyToken}`;

    await sendEmail(email, link);

    res.json({
      message: "Signup successful. Please verify your email."
    });
  } catch (err) {
    res.status(500).send("Signup failed");
  }
};

/* =========================
   VERIFY EMAIL
========================= */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const userId = await redisClient.get(`verify:${token}`);
    if (!userId)
      return res.status(400).send("Invalid or expired link");

    await User.findByIdAndUpdate(userId, {
      emailVerified: true
    });

    await redisClient.del(`verify:${token}`);

    res.send("Email verified successfully. You can now login.");
  } catch (err) {
    res.status(500).send("Email verification failed");
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    if (!user.emailVerified)
      return res.status(401).send("Please verify your email");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Wrong password");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ PRODUCTION COOKIE (RENDER)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
      path: "/"
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).send("Login failed");
  }
};


/* =========================
   DASHBOARD
========================= */
exports.dashboard = async (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email
  });
};

/* =========================
   LOGOUT
========================= */
// exports.logout = async (req, res) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.send("Already logged out");

//     const decoded = jwt.decode(token);

//     await redisClient.set(
//       `block:${token}`,
//       "blocked",
//       {
//         EX: decoded.exp - Math.floor(Date.now() / 1000)
//       }
//     );

//     res.clearCookie("token", { path: "/" });
//     res.send("Logged out successfully");
//   } catch (err) {
//     res.status(500).send("Logout failed");
//   }
// };


exports.logout = async (req, res) => {
  console.log("LOGOUT HIT");
  res.clearCookie("token", { path: "/" });
  res.send("Logged out");
};

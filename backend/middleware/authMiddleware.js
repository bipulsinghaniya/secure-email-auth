// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const redisClient = require("../config/redis");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).send("No token");
//     }

//     // 🔴 Check blacklist (logout)
//     const isBlocked = await redisClient.exists(`block:${token}`);
//     if (isBlocked) {
//       return res.status(401).send("Token blocked");
//     }

//     // ✅ Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ Get user (exclude password)
//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(401).send("User not found");
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).send("Invalid or expired token");
//   }
// };

// module.exports = authMiddleware;




const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    // ✅ CHECK REDIS BLACKLIST
    const isBlocked = await redisClient.get(`block:${token}`);
    if (isBlocked) {
      return res.status(401).json({ message: "Token blocked" });
    }

    // ✅ VERIFY JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ATTACH USER
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

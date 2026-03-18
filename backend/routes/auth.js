const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", ctrl.signup);
router.post("/verify-otp", ctrl.verifyOtp);
router.post("/login", ctrl.login);
router.get("/dashboard", auth, ctrl.dashboard);
router.post("/logout", auth, ctrl.logout);

module.exports = router;

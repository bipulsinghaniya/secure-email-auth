const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", ctrl.signup);
router.get("/verify", ctrl.verifyEmail);
router.post("/login", ctrl.login);
router.get("/dashboard", auth, ctrl.dashboard);
router.post("/logout", auth, ctrl.logout);

module.exports = router;

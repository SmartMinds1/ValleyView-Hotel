const express = require("express");
const authController = require("../controllers/authController");
const { registerLimiter, loginLimiter } = require("../middlewares/limiter");
const checkAccessBlacklist = require("../middlewares/checkAccessBlacklist");
const checkRefreshBlacklist = require("../middlewares/chekRefreshBlacklist");
const authenticateToken = require("../middlewares/authMiddleware");
const { authorizeRoles } = require('../middlewares/authorizeRoles');


const {
  usernameValidation,
  emailValidation,
  passwordValidation,
} = require("../middlewares/validators");

const router = express.Router();

// User Registration
router.post(
  "/register",
  registerLimiter,
  [usernameValidation, emailValidation, passwordValidation],
  authController.register
);

// User Login
router.post(
  "/login",
  loginLimiter,
  [usernameValidation, passwordValidation],
  authController.login
);

// Refresh Token
router.post(
  "/refresh-token",
  [checkRefreshBlacklist],
  authController.refreshToken
);

// Verify the accessToken to allow auto re_login
router.post(
  "/verify-access",
  [checkAccessBlacklist],
  authController.accessTokenLogin
);

// User routes
router.get('/user', authenticateToken, authController.getUser); 
router.get('/user/current', authenticateToken, authController.getCurrentUser); 
router.get('/user/with-sessions', authenticateToken, authorizeRoles(['admin']), authController.getUserWithSessions);
// Logout
router.post("/logout", [checkAccessBlacklist], authController.logout);

module.exports = router;

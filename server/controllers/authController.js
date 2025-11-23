//This file handles all the authentication logic
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");
const jwtHelper = require("../utils/jwtHelper");
const { query } = require("../utils/pgHelper");

const MAX_SESSIONS = process.env.MAX_SESSIONS;

// User Registration <-----------------------------------------------
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  // Get data from request body
  let { username, email, password } = req.body;

  try {
    const saltRounds = process.env.NODE_ENV === "production" ? 12 : 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Determine who is creating the user
    // If an admin is logged in and adding users, use their email.
    // Otherwise, assume self-registration and set created_by = email.
    const createdBy = req.user?.email || email;
    const updatedBy = req.user?.email || email;

    // Add user to database with audit fields
    await query(
      `INSERT INTO smartygrand_users 
        (username, email, password, created_by, updated_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [username, email, hashedPassword, createdBy, updatedBy]
    );

    logger.info(`User registered: ${username} (created_by: ${createdBy})`);
    res.status(201).json({ message: "Registration Successful!" });
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL duplicate entry error
      logger.warn(`Registration failed: Duplicate entry for ${username}`);
      return res
        .status(409)
        .json({ message: "Username or email already exists!" });
    }

    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

// User Login <--------------------<---------------------------
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const result = await query(
      "SELECT id, username, password, role, is_active FROM smartygrand_users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      logger.warn(`Login failed: User not found (${username})`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = result.rows[0];

    //check if user account is disabled
    if (!user.is_active)
      return res.status(403).json({ message: "Account disabled." });

    //if Enabled, validate credentials
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password for (${username})`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // -- LIMITING1 CONCURRENT SESSIONS ---
    const activeSessions = await query(
      `SELECT id, loggedin_at FROM smartygrand_user_sessions 
       WHERE user_id = $1 AND is_active = true 
       ORDER BY loggedin_at ASC`, // oldest first
      [user.id]
    );

    if (activeSessions.rows.length >= MAX_SESSIONS) {
      const oldestSession = activeSessions.rows[0]; // oldest active one

      await query(
        `UPDATE smartygrand_user_sessions 
         SET is_active = false 
         WHERE id = $1`,
        [oldestSession.id]
      );

      logger.info(
        `Oldest session disabled for user: ${username} to enforce limit of ${MAX_SESSIONS}`
      );
    }

    //get access token from jwtHelper
    const accessToken = jwtHelper.generateAccessToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    //get refresh token from jwtHelper
    const refreshToken = jwtHelper.generateRefreshToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Hash the refresh token before saving
    const saltRounds = 12;
    const refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);

    // TRACK this session
    // Capture device + IP info
    const ipAddress = req.ip;
    const deviceInfo = req.headers["user-agent"] || "Unknown device";

    // Store new session in DB
    await query(
      `INSERT INTO smartygrand_user_sessions 
      (user_id, refresh_token_hash, ip_address, device_info, is_active, loggedin_at, last_activity_at)
      VALUES ($1, $2, $3, $4, true, NOW(), NOW())`,
      [user.id, refreshTokenHash, ipAddress, deviceInfo]
    );

    console.log("Creating a new session for:", username);

    //using a cookie to store refreshToken
    console.log("Setting cookie for:", username);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, role: user.role, username: user.username });
    logger.info(`Login successful: ${username}`);
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

//AUTO login if already have an accessToken <------------------------------------------
exports.accessTokenLogin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const accessToken = authHeader.split(" ")[1];
    const decoded = jwtHelper.verifyAccessToken(accessToken);

    return res.json({ user: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

//Login with EXISTING Refresh Token <------------------------<----------------------
exports.refreshToken = async (req, res) => {
  // Get refresh token from cookies
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    // Verify refresh token
    const payload = jwtHelper.verifyToken(refreshToken);
    if (!payload) {
      logger.warn("Invalid refresh token.");
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Capture current device and IP information from this refresh request
    const currentIp = req.ip;
    const currentDevice = req.headers["user-agent"] || "Unknown device";

    // Fetch all active sessions for this user
    const result = await query(
      `SELECT id, refresh_token_hash, ip_address, device_info
    FROM smartygrand_user_sessions
    WHERE user_id = $1 AND is_active = true`,
      [payload.id]
    );

    let validSession = null;
    for (const session of result.rows) {
      const match = await bcrypt.compare(
        refreshToken,
        session.refresh_token_hash
      );
      if (match) {
        validSession = session;
        break;
      }
    }

    if (!validSession) {
      logger.warn("Refresh token mismatch or tampered.");
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // ---STRICT MODE SECURITY CHECK---
    // Ensure refresh request comes from same IP and device as the login session
    const ipMismatch =
      validSession.ip_address && validSession.ip_address !== currentIp;
    const deviceMismatch =
      validSession.device_info && validSession.device_info !== currentDevice;

    if (ipMismatch || deviceMismatch) {
      // Mark session as suspicious and deactivate immediately
      await query(
        `UPDATE smartygrand_user_sessions
         SET is_active = false, logged_out_at = NOW()
         WHERE id = $1`,
        [validSession.id]
      );

      logger.warn(
        `Suspicious refresh detected for user: ${payload.username}. 
         IP/Device mismatch — Session deactivated.`
      );

      // Block the request and notify client
      return res.status(403).json({
        message:
          "Suspicious activity detected. Session terminated for security reasons.",
      });
    }

    //OTHERWISE, UPDATE last activity session
    await query(
      `UPDATE smartygrand_user_sessions
       SET last_activity_at = NOW()
       WHERE id = $1`,
      [validSession.id]
    );

    // Token is valid — proceed to issue new access token
    const newAccessToken = jwtHelper.generateAccessToken({
      id: payload.id,
      username: payload.username,
      role: payload.role,
    });

    // Re-set cookie expiry (to keep session alive)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(`New access token issued for user: ${payload.username}`);
    res.json({
      accessToken: newAccessToken,
      role: payload.role,
      username: payload.username,
    });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Logout <-----------------------------------------------
exports.logout = async (req, res) => {
  try {
    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access token missing or invalid." });
    }
    const accessToken = authHeader.split(" ")[1];

    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing." });
    }

    // Verify access token
    const decoded = jwtHelper.verifyAccessToken(accessToken);
    if (!decoded) {
      logger.warn("Invalid access token during logout.");
      return res.status(403).json({ message: "Invalid access token." });
    }

    // Blacklist the access token in Redis
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    await jwtHelper.blacklistToken(accessToken, expiresIn);

    // Verify and blacklist refresh token
    const payload2 = jwtHelper.verifyToken(refreshToken);
    if (!payload2) {
      logger.warn("Invalid refresh token during logout.");
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const refreshExpiresIn = payload2.exp - Math.floor(Date.now() / 1000);
    await jwtHelper.blacklistToken(refreshToken, refreshExpiresIn);

    // Fetch all sessions for this user
    const sessions = await query(
      `SELECT id, refresh_token_hash FROM smartygrand_user_sessions WHERE user_id = $1 AND is_active = true`,
      [payload2.id]
    );

    // Compare to find the matching session
    let matchedSessionId = null;
    for (const session of sessions.rows) {
      const match = await bcrypt.compare(
        refreshToken,
        session.refresh_token_hash
      );
      if (match) {
        matchedSessionId = session.id;
        break;
      }
    }

    if (!matchedSessionId) {
      logger.warn("Logout failed: Refresh token not found in DB.");
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Deactivate the correct session and update logout time
    await query(
      `UPDATE smartygrand_user_sessions
       SET is_active = false,
           logged_out_at = NOW()
       WHERE id = $1`,
      [matchedSessionId]
    );

    logger.info("Session DEACTIVATED successfully!");

    // Clear cookie securely
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    // Send success response
    logger.info(`User logged out: ${decoded.username}`);
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};


// Get Single User by ID or Username <-----------------------------------------------
exports.getUser = async (req, res) => {
  try {
    const { id, username } = req.query; // Accept either id or username as query parameter

    if (!id && !username) {
      return res.status(400).json({ 
        message: "Either 'id' or 'username' parameter is required" 
      });
    }

    let queryString;
    let queryParams;

    if (id) {
      queryString = `
        SELECT 
          id, 
          username, 
          email, 
          role, 
          is_active, 
          created_by, 
          updated_by, 
          created_at, 
          updated_at
        FROM smartygrand_users 
        WHERE id = $1
      `;
      queryParams = [id];
    } else {
      queryString = `
        SELECT 
          id, 
          username, 
          email, 
          role, 
          is_active, 
          created_by, 
          updated_by, 
          created_at, 
          updated_at
        FROM smartygrand_users 
        WHERE username = $1
      `;
      queryParams = [username];
    }

    const result = await query(queryString, queryParams);

    if (result.rows.length === 0) {
      logger.warn(`User not found: ${id ? 'ID: ' + id : 'Username: ' + username}`);
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Remove sensitive information before sending response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_by: user.created_by,
      updated_by: user.updated_by,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    logger.info(`User retrieved: ${user.username} (by ${req.user?.username || 'system'})`);
    res.json({ user: userResponse });

  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get Current User Profile <-----------------------------------------------
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware

    const result = await query(
      `SELECT 
        id, 
        username, 
        email, 
        role, 
        is_active, 
        created_by, 
        updated_by, 
        created_at, 
        updated_at
      FROM smartygrand_users 
      WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      logger.warn(`Current user not found: ID ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Remove sensitive information before sending response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_by: user.created_by,
      updated_by: user.updated_by,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    logger.info(`Current user profile retrieved: ${user.username}`);
    res.json({ user: userResponse });

  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get User with Active Sessions <-----------------------------------------------
exports.getUserWithSessions = async (req, res) => {
  try {
    const { id, username } = req.query;

    if (!id && !username) {
      return res.status(400).json({ 
        message: "Either 'id' or 'username' parameter is required" 
      });
    }

    let queryString;
    let queryParams;

    if (id) {
      queryString = `
        SELECT 
          u.id, 
          u.username, 
          u.email, 
          u.role, 
          u.is_active, 
          u.created_at,
          u.updated_at,
          COUNT(s.id) as active_sessions_count,
          JSON_AGG(
            CASE 
              WHEN s.id IS NOT NULL THEN
                JSON_BUILD_OBJECT(
                  'session_id', s.id,
                  'ip_address', s.ip_address,
                  'device_info', s.device_info,
                  'loggedin_at', s.loggedin_at,
                  'last_activity_at', s.last_activity_at
                )
              ELSE NULL
            END
          ) FILTER (WHERE s.id IS NOT NULL) as active_sessions
        FROM smartygrand_users u
        LEFT JOIN smartygrand_user_sessions s ON u.id = s.user_id AND s.is_active = true
        WHERE u.id = $1
        GROUP BY u.id, u.username, u.email, u.role, u.is_active, u.created_at, u.updated_at
      `;
      queryParams = [id];
    } else {
      queryString = `
        SELECT 
          u.id, 
          u.username, 
          u.email, 
          u.role, 
          u.is_active, 
          u.created_at,
          u.updated_at,
          COUNT(s.id) as active_sessions_count,
          JSON_AGG(
            CASE 
              WHEN s.id IS NOT NULL THEN
                JSON_BUILD_OBJECT(
                  'session_id', s.id,
                  'ip_address', s.ip_address,
                  'device_info', s.device_info,
                  'loggedin_at', s.loggedin_at,
                  'last_activity_at', s.last_activity_at
                )
              ELSE NULL
            END
          ) FILTER (WHERE s.id IS NOT NULL) as active_sessions
        FROM smartygrand_users u
        LEFT JOIN smartygrand_user_sessions s ON u.id = s.user_id AND s.is_active = true
        WHERE u.username = $1
        GROUP BY u.id, u.username, u.email, u.role, u.is_active, u.created_at, u.updated_at
      `;
      queryParams = [username];
    }

    const result = await query(queryString, queryParams);

    if (result.rows.length === 0) {
      logger.warn(`User not found: ${id ? 'ID: ' + id : 'Username: ' + username}`);
      return res.status(404).json({ message: "User not found" });
    }

    const userData = result.rows[0];

    const userResponse = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      is_active: userData.is_active,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      active_sessions_count: parseInt(userData.active_sessions_count),
      active_sessions: userData.active_sessions || []
    };

    logger.info(`User with sessions retrieved: ${userData.username} (by ${req.user?.username || 'system'})`);
    res.json({ user: userResponse });

  } catch (error) {
    logger.error(`Get user with sessions error: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};
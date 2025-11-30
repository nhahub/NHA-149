import User from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/verifyToken.js";

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token using the verifyToken utility
    const decoded = await verifyToken({ token });

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Account is pending admin approval.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

// Optional authentication - doesn't fail if no token provided
export const optionalAuthenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      // No token provided, continue without authentication
      return next();
    }

    // Verify token using the verifyToken utility
    const decoded = await verifyToken({ token });

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (user && user.isActive && (user.isApproved || user.role === "admin")) {
      req.user = user;
    }

    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
};

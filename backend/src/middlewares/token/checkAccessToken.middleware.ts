// src/middlewares/accessTokenCheck.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../../types";
import { User } from "../../types";
import { generateAccessToken } from "../../utils/generateToken";
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const checkAccessTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    const refreshToken = req.cookies.refreshToken;
    console.log("RefreshToken:", refreshToken);
    if (!refreshToken) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "Access token required", action: "login" });
    }
    // Handle refresh token logic here
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as User;
      const newAccessToken = await generateAccessToken(refreshToken);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true, // Required for cross-origin HTTPS
        sameSite: "none", // Required for cross-origin cookies
        maxAge: 15 * 60 * 1000, // 15 minutes
        domain: undefined // Let browser handle domain
      });
      req.user = decoded;
      return next();
    } catch (error) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "Invalid refresh token", action: "login" });
    }
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as User;
    req.user = decoded;
    return next();
  } catch (error) {
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: "Invalid access token" });
  }
};

export default checkAccessTokenMiddleware;

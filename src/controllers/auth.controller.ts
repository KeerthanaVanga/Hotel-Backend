import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";
import {
  setAuthCookies,
  clearAuthCookies,
} from "../utils/cookies";
import { AuthRequest } from "../middlewares/auth.middleware";

/* ================= REGISTER ================= */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.admin.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.admin.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* ================= LOGOUT ================= */
export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.userId) {
      await prisma.admin.update({
        where: { id: req.userId },
        data: { refreshToken: null },
      });
    }

    clearAuthCookies(res);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* ================= REFRESH TOKEN ================= */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: number };

    const user = await prisma.admin.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newAccessToken = generateAccessToken(user.id);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Token refreshed",
    });
  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }
};

/* ================= CHECK USER ================= */
export const checkUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.admin.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("CHECK USER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

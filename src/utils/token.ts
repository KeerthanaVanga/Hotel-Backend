import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: number) => {
  return jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "3h" }
  );
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );
};

import jwt from "jsonwebtoken";

export const verifyToken = async ({
  token,
  signature = process.env.JWT_SECRET,
}) => {
  return jwt.verify(token, signature);
};

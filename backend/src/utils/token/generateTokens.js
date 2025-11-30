import { generateToken } from "./generateToken.js";

export const generateTokens = async (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };

  // Use the same JWT_SECRET for all users to ensure consistency
  const access_token = await generateToken({
    payload,
    signature: process.env.JWT_SECRET,
    options: { expiresIn: "1h" },
  });

  const refresh_token = await generateToken({
    payload,
    signature: process.env.JWT_SECRET,
    options: { expiresIn: "7d" },
  });

  return { access_token, refresh_token };
};

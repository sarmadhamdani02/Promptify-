import jwt from "jsonwebtoken";

export function signJwt(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  }); // ✅ 7-day token
}

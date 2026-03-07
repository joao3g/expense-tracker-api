import { JwtUserPayload } from "./jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
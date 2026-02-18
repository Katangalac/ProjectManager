import { JwtPayload } from "jsonwebtoken";
import { TokenPayload } from "@/types/Auth";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

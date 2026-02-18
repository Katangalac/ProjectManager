import { JwtPayload } from "jsonwebtoken";
import { TokenPayload } from "../Auth";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

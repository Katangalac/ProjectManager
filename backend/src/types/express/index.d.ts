import { JwtPayload } from 'jsonwebtoken'
import { TokenPayloadType } from '../../auth/types/Auth'

declare global{
    namespace Express{
        interface Request{
            user?: TokenPayloadType;
        };
    }
}


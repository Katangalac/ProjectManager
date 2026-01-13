import { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '../../auth/Auth';

declare global{
    namespace Express{
        interface Request{
            user?: TokenPayload;
        };
    }
}


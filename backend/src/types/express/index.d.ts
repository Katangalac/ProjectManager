import { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '../../auth/types/Auth';

declare global{
    namespace Express{
        interface Request{
            user?: TokenPayload;
        };
    }
}


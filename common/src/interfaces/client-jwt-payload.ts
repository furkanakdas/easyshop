
import jwt  from 'jsonwebtoken';
import { CurrentUser } from './current-user';


export interface ClientJwtPayload   extends jwt.JwtPayload,CurrentUser  {
    
}
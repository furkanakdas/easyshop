
import jwt  from 'jsonwebtoken';
import { CurrentUser } from './current-user';


export interface CreateClientJwtPayload   extends CurrentUser  {
    
}
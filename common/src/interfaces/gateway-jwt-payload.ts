import jwt  from 'jsonwebtoken';
import { CurrentUser } from './current-user';
import { ClientJwtPayload } from './client-jwt-payload';


export interface GatewayJwtPayload extends jwt.JwtPayload  {

    clientJwtPayload:ClientJwtPayload|undefined

}
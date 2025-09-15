

import jwt  from 'jsonwebtoken';


export function verifyJwtRS256<T extends jwt.JwtPayload>(token:string,publicKey:string,options:jwt.VerifyOptions)  {

    const payload = jwt.verify(
        token,
        publicKey,
        { 
         ...options,
         algorithms: ['RS256'],
        }
    );

    return payload as T;
}



import jwt  from 'jsonwebtoken';



export function createJwtRS256<T extends string | Record<string, any> >(payload:T,privateKey:string,options:jwt.SignOptions) {

    const token = jwt.sign(payload,privateKey , {
      expiresIn:"8h",
      ...options,
      algorithm:"RS256",
    });

    return token;
}





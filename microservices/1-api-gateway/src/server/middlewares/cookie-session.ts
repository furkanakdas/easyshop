
import cookieSession from "cookie-session"
import { config } from "../../config"



export const cookieSessionMiddleware = cookieSession({
    name: 'session',
    //Zaten jwt'ler şifreli
    signed: false,
    secure: false,
    sameSite: 'lax',
    httpOnly: true,
});
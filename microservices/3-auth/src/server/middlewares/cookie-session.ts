
import cookieSession from "cookie-session"
import { config } from "../../config"


// export const cookieSessionMiddleware = cookieSession({
//     name: 'session',
//     keys: [config.COOKIE_KEY_ONE, config.COOKIE_KEY_TWO],
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     secure: config.NODE_ENV === "production",
//     sameSite: "lax",
//     httpOnly: true,
// })

export const cookieSessionMiddleware = cookieSession({
    name: 'session',
    //Zaten jwt'ler şifreli
    signed:false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false,
    sameSite: "lax",
    httpOnly: true,
})
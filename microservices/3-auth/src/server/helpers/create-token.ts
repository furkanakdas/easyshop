import crypto from'crypto'


export function createToken(){
    return crypto.randomBytes(16).toString('hex')
}

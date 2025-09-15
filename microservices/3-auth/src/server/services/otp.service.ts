// import { dbClient } from "../clients/database.client";

// const otpStore = new Map<string, { otp: string, expiresAt: number }>();

// export function generateOtp(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// export async function sendOtp(email: string, otp: string) {
//   console.log(`OTP to ${email}: ${otp}`);

//   // publish OPT created event to notification server
    

// }



// export async function storeOtp(userId: string, otp: string) {

//   otpStore.set(userId, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); 
// }

// export async function verifyOtp(userId: string, otp: string): Promise<boolean> {

//   const record = otpStore.get(userId);
//   if (!record) return false;
//   const valid = record.otp === otp && Date.now() < record.expiresAt;
//   if (valid) otpStore.delete(userId);
//   return valid;
// }

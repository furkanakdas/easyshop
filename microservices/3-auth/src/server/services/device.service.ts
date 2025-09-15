// import { Request } from 'express';
// import { createHash } from '../helpers/hash';

// const trustedDevices = new Map<string, string[]>(); 

// export function getDeviceId(req: Request): string {
//   const ua = req.useragent?.source || '';
//   const ip = req.ip;
//   return createHash(ua + ip); 
// }

// export async function isDeviceTrusted(userId: string, deviceId: string): Promise<boolean> {
//   const list = trustedDevices.get(userId) || [];
//   return list.includes(deviceId);
// }

// export async function saveTrustedDevice(userId: string, deviceId: string): Promise<void> {
//   const list = trustedDevices.get(userId) || [];
//   if (!list.includes(deviceId)) {
//     trustedDevices.set(userId, [...list, deviceId]);
//   }
// }

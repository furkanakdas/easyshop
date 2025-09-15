import { Request } from "express";
import { createHash } from "./hash";




export function getDeviceId(req: Request): string {
  const ua = req.useragent?.source || '';
  const ip = req.ip;
  return createHash(ua + ip); 
}
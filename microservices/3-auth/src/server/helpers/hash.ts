import { createHash as cryptoCreateHash } from 'crypto';



export function createHash(data: string): string {
  return cryptoCreateHash('sha256').update(data).digest('hex');
}
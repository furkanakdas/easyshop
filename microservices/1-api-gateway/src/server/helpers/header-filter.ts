// helpers/HeaderFilter.ts

import { IncomingHttpHeaders } from 'http';

export class HeaderFilter {
  // Mikroservislere aktarılması güvenli olan başlıklar
  private static readonly allowedHeaders = [
    'authorization',
    'content-type',
    'accept',
    'user-agent',
    'origin',
    'x-request-id',
  ];

  // İsteğin başlıklarını filtreleyip sadece gerekli olanları döner
  static filter(headers: IncomingHttpHeaders): Record<string, string> {
    const filtered: Record<string, string> = {};

    for (const key of Object.keys(headers)) {
      const lowerKey = key.toLowerCase();
      if (HeaderFilter.allowedHeaders.includes(lowerKey) && headers[key]) {
        filtered[lowerKey] = String(headers[key]);
      }
    }

    return filtered;
  }
}

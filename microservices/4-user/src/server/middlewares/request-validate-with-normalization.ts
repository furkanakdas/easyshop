// // middleware/validateWithNormalization.ts
// import { NextFunction, Request, Response } from 'express';
// import { ZodObject } from 'zod';
// import { normalizeBySchema } from '../helpers/normalize-by-schema';

// export function validateWithNormalization<T extends ZodObject<any>>(schema: T) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // 1. Normalize et
//       const normalizedBody = normalizeBySchema(schema, req.body);

//       // 2. Zod doğrulaması
//       const result = schema.safeParse(normalizedBody);
//       if (!result.success) {
//         return res.status(400).json({ error: result.error.flatten() });
//       }

//       // 3. Doğrulanmış body'yi ekle
//       req.body = result.data;
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// }
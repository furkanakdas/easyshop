// // utils/normalizeBySchema.ts
// import { z, ZodObject, ZodTypeAny } from 'zod';

// export function normalizeBySchema<T extends ZodObject<any>>(schema: T, input: any): any {
//   const shape = schema.shape;
//   const result: any = {};

//   for (const key in shape) {
//     if (Object.prototype.hasOwnProperty.call(input, key)) {
//       const val = input[key];
//       result[key] = val === undefined ? null : val;
//     } else {
//       result[key] = null;
//     }
//   }

//   return result;
// }


// export function deepNormalizeBySchema<T extends ZodObject<any>>(schema: T, input: any): any {
//     const shape = schema.shape;
//     const result: any = {};
  
//     for (const key in shape) {
//       const subSchema = shape[key] as ZodTypeAny;
//       const value = input?.[key];
  
//       if (subSchema instanceof z.ZodObject) {
//         // İç içe obje ise recursive normalize
//         result[key] = deepNormalizeBySchema(subSchema, value ?? {});
//       } else {
//         result[key] = value === undefined ? null : value;
//       }
//     }
  
//     return result;
//   }
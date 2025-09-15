import { z } from "zod";




export const verifyOptSchema = z.object({
  body: z.undefined(),

  query: z.object({
    otp: z.string(),
  }).strict(),
  params: z.object({}).strict(),
});

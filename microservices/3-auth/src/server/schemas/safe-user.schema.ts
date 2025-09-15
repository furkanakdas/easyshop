


import { UserRole } from "@faeasyshop/common";
import { z } from "zod";

export const safeUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt:z.date().nullable(),
  isEmailVerified:z.boolean(),
  emailVerificationExpiresAt:z.date().nullable(),
  refreshTokenExpiresAt:z.date().nullable(),
  resetPasswordExpiresAt:z.date().nullable(),
});


import { z } from 'zod';

export const createSellerSchema = z.object({
    body: z.object({

        email: z.string().email(),
        phone: z.string().regex(/^\+90\d{10}$/, {
            message: "Geçerli bir telefon numarasi giriniz. Örn: +905xxxxxxxxx",
        }),
        identityNumber: z.string().regex(/^[1-9][0-9]{10}$/, {
            message: 'Geçerli bir T.C. Kimlik Numarası giriniz.',
        }),
        businessName: z.string(),
        businessDescription: z.string().optional(),
        companyType: z.enum(["SOLE_PROPRIETORSHIP"]),
        iban: z.string().regex(/^TR\d{24}$/, {
            message: 'Geçerli bir IBAN giriniz (TR ile başlayan, 26 karakter).',
        }),
        taxId: z.string().regex(/^[1-9][0-9]{10}$/, {
            message: 'Geçerli bir Vergi Kimlik Numarası giriniz (10 hane).',
        }),
    }).strict().refine((data) => data.identityNumber === data.taxId, {
        message: 'TaxId and identityNumber should be equal',
        path: ['taxId'],
    }),

    query: z.object({}).strict(),
    params: z.object({}).strict(),
});


export type CreateSellerSchema = z.infer<typeof createSellerSchema>;
export type CreateSellerBody = z.infer<typeof createSellerSchema>["body"];
export type CreateSellerQuery = z.infer<typeof createSellerSchema>["query"];
export type CreateSellerParams = z.infer<typeof createSellerSchema>["params"];













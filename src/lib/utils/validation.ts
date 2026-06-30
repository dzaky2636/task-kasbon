import { z } from "zod";

export const createDebtSchema = z.object({
  type: z.enum(["owed_to_me", "i_owe"], {
    message: "Tipe harus owed_to_me atau i_owe",
  }),
  counterpart_name: z
    .string("Nama harus berupa teks")
    .min(1, "Nama harus diisi")
    .trim(),
  amount: z
    .number("Jumlah harus berupa angka")
    .positive("Jumlah harus lebih dari 0"),
  due_date: z
    .string("Tanggal harus berupa teks")
    .optional(),
  note: z
    .string("Catatan harus berupa teks")
    .max(200, "Catatan maksimal 200 karakter")
    .optional(),
});

export const updateDebtSchema = z.object({
  type: z
    .enum(["owed_to_me", "i_owe"], {
      message: "Tipe harus owed_to_me atau i_owe",
    })
    .optional(),
  counterpart_name: z
    .string("Nama harus berupa teks")
    .min(1, "Nama harus diisi")
    .trim()
    .optional(),
  amount: z
    .number("Jumlah harus berupa angka")
    .positive("Jumlah harus lebih dari 0")
    .optional(),
  due_date: z
    .string("Tanggal harus berupa teks")
    .optional()
    .nullable(),
  note: z
    .string("Catatan harus berupa teks")
    .max(200, "Catatan maksimal 200 karakter")
    .optional()
    .nullable(),
  settled_at: z
    .string("Status harus berupa teks")
    .optional()
    .nullable(),
});

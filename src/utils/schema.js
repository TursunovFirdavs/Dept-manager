import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email kiritish shart")
    .email("Email noto'g'ri formatda"),
  password: z
    .string()
    .min(1, "Parol kiritish shart")
    .min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
});

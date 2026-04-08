import { z } from "zod";

export const admissionApplySchema = z.object({
  studentName: z.string().min(2).max(100),
  dateOfBirth: z.string().min(1),
  age: z.number().int().min(1).max(10),
  parentName: z.string().min(2).max(100),
  phoneNumber: z.string().min(7).max(20),
  email: z.string().email(),
  programId: z.string().min(1),
  address: z.string().min(5).max(500),
});

export type AdmissionApplyInput = z.infer<typeof admissionApplySchema>;


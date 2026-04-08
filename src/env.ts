import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    EMAIL_FROM: z.string().min(1),
    EMAIL_PROVIDER: z.enum(["console", "resend", "sendgrid"]).default("console"),
    RESEND_API_KEY: z.string().optional(),
    SENDGRID_API_KEY: z.string().optional(),

    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_PUBLIC_BASE_URL: z.string().optional(),

    WHATSAPP_PROVIDER: z.enum(["noop"]).default("noop"),
    WHATSAPP_API_KEY: z.string().optional(),
  },
  client: {},
  experimental__runtimeEnv: {},
});


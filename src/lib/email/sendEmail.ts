import { env } from "@/env";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: SendEmailInput) {
  if (env.EMAIL_PROVIDER === "console") {
    // eslint-disable-next-line no-console
    console.log(
      [
        "----- EMAIL (console provider) -----",
        `From: ${env.EMAIL_FROM}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "",
        text,
        "------------------------------------",
      ].join("\n"),
    );
    return;
  }

  throw new Error(`EMAIL_PROVIDER not implemented: ${env.EMAIL_PROVIDER}`);
}


/**
 * WhatsApp provider adapter - no-op until a provider (Twilio/Gupshup/Meta BSP) is configured.
 * When ready, implement sendWhatsAppMessage and set WHATSAPP_PROVIDER in env.
 */

export type WhatsAppSendInput = {
  to: string;
  templateId?: string;
  body?: string;
};

export async function sendWhatsAppMessage(_input: WhatsAppSendInput): Promise<boolean> {
  // No-op: provider not configured yet.
  return false;
}

import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0'
};

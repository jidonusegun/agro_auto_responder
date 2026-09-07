import axios from 'axios';
import { env } from '../config/env.js';

const endpoint = `https://graph.facebook.com/${env.apiVersion}/${env.phoneNumberId}/messages`;
export async function sendResponse(to, response) {
  const payload = { messaging_product: 'whatsapp', to, type: 'text', text: { body: response.question } };
  if (response.type === 'list' && response.options?.length) {
    payload.type = 'interactive';
    payload.interactive = { type: 'list', body: { text: response.question }, action: { button: 'Choose an option', sections: [{ title: 'Options', rows: response.options.map((o) => ({ id: o.id, title: o.label.slice(0, 24), description: o.description?.slice(0, 72) })) }] } };
  }
  await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${env.accessToken}`, 'Content-Type': 'application/json' } });
  return response.question;
}

export function extractIncomingMessage(value) {
  const message = value?.messages?.[0];
  if (!message) return null;
  const text = message.text?.body || message.interactive?.list_reply?.id || message.interactive?.button_reply?.id;
  return text ? { phone: message.from, name: value.contacts?.[0]?.profile?.name, text } : null;
}

import { env } from '../config/env.js';
import { findOrCreateCustomer } from '../services/customer.service.js';
import { receiveMessage, recordOutbound } from '../services/conversation.service.js';
import { extractIncomingMessage, sendResponse } from '../services/whatsapp.service.js';

export function verifyWebhook(req, res) {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === env.verifyToken) return res.status(200).send(req.query['hub.challenge']);
  return res.sendStatus(403);
}

export async function handleWebhook(req, res, next) {
  console.log('========== WHATSAPP WEBHOOK RECEIVED ==========');
  console.log('Webhook body:', JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    console.log(
      'Incoming value:',
      JSON.stringify(value, null, 2)
    );

    const incoming = extractIncomingMessage(value);

    console.log(
      'Extracted message:',
      JSON.stringify(incoming, null, 2)
    );

    if (!incoming) return;
    const customer = await findOrCreateCustomer(incoming.phone, incoming.name);

    console.log('Customer:', customer);

    const result = await receiveMessage(customer, incoming.text);

    console.log(
      'Conversation result:',
      JSON.stringify(result, null, 2)
    );

    const body = await sendResponse(incoming.phone, result.response);
    console.log('WhatsApp response sent successfully');

    await recordOutbound(result.conversation.id, body);
  } catch (error) {
    console.error(
      'WEBHOOK PROCESSING ERROR:',
      error.response?.data || error
    );
    
    next(error); }
}

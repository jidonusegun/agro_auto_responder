import { env } from '../config/env.js';
import { findOrCreateCustomer } from '../services/customer.service.js';
import { receiveMessage, recordOutbound } from '../services/conversation.service.js';
import { extractIncomingMessage, sendResponse } from '../services/whatsapp.service.js';

export function verifyWebhook(req, res) {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === env.verifyToken) return res.status(200).send(req.query['hub.challenge']);
  return res.sendStatus(403);
}

export async function handleWebhook(req, res, next) {
  res.sendStatus(200);
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    const incoming = extractIncomingMessage(value);
    if (!incoming) return;
    const customer = await findOrCreateCustomer(incoming.phone, incoming.name);
    const result = await receiveMessage(customer, incoming.text);
    console.log('result from receiveMessage', result);
    const body = await sendResponse(incoming.phone, result.response);
    console.log('body from sendResponse', body);
    await recordOutbound(result.conversation.id, body);
    console.log('body from recordOutbound', body);
  } catch (error) { next(error); }
}

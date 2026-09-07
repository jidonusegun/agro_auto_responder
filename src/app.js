import express from 'express';
import { verifyWebhook, handleWebhook } from './controllers/whatsapp.controller.js';
import { listFlows, upsertFlow } from './controllers/admin.controller.js';

export const app = express();
app.use(express.json());
app.get('/health', (_, res) => res.json({ ok: true }));
app.get('/webhook', verifyWebhook);
app.post('/webhook', handleWebhook);
app.get('/admin/flows', listFlows);
app.put('/admin/flows/:id', upsertFlow);
app.post('/webhook-test', (req, res) => {
    console.log('🔥 WEBHOOK TEST HIT');
    console.log(JSON.stringify(req.body, null, 2));
  
    res.status(200).json({ received: true });
  });
app.use((error, _req, _res, _next) => console.error(error));

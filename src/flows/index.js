import { purchaseFlow } from './purchase.flow.js';
import { consultationFlow } from './consultation.flow.js';

export const flows = Object.fromEntries([purchaseFlow, consultationFlow].map((flow) => [flow.id, flow]));

export const mainMenu = {
  type: 'list', question: 'Welcome to Agro Farm 👋\nPlease choose an option:',
  options: [
    { id: 'purchase', label: 'Purchase farm products', description: 'Fish, pig, or coconut' },
    { id: 'consultation', label: 'Consultation', description: 'Talk to our farm experts' },
    { id: 'agent', label: 'Speak to an agent', description: 'Request human assistance' }
  ]
};

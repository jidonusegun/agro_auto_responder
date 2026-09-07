export const consultationFlow = {
  id: 'consultation', name: 'Consultation', startStepId: 'topic',
  steps: {
    topic: { type: 'text', question: 'What would you like to consult us about?', next: 'phone' },
    phone: { type: 'phone', question: 'Please share your 11-digit Nigerian phone number.', validate: (v) => /^(?:\+234|234|0)\d{10}$/.test(v.replace(/[\s-]/g, '')), validationMessage: 'Please enter a valid Nigerian phone number.', next: null }
  },
  completionMessage: '✅ Thank you. Your consultation request has been received.'
};

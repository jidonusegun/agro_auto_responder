const nigeriaPhone = (value) => /^(?:\+234|234|0)\d{10}$/.test(value.replace(/[\s-]/g, ''));

export const purchaseFlow = {
  id: 'purchase',
  name: 'Purchase',
  startStepId: 'product',
  steps: {
    product: {
      type: 'list',
      question: 'What would you like to buy?',
      options: [
        { id: 'catfish', label: 'Buy fish', value: 'Cat fish', next: 'location' },
        { id: 'pig', label: 'Buy pig', value: 'Pig', next: 'location' },
        { id: 'coconut', label: 'Buy coconut', value: 'Coconut', next: 'location' }
      ]
    },
    location: {
      type: 'list',
      question: 'Step 1 of 4: Where is your location?',
      options: [
        { id: 'badagry', label: 'Within Badagry', value: 'Badagry', next: 'address' },
        { id: 'lagos', label: 'Within Lagos', value: 'Lagos', next: 'address' },
        { id: 'ogun', label: 'Ogun State', value: 'Ogun State', next: 'address' }
      ]
    },
    address: { type: 'text', question: 'Step 2 of 4: Please provide the delivery address.', next: 'phone' },
    phone: {
      type: 'phone', question: 'Step 3 of 4: Please provide your 11-digit Nigerian phone number.',
      validate: nigeriaPhone, validationMessage: "That doesn't appear to be a valid Nigerian phone number. Please try again.", next: 'quantity'
    },
    quantity: { type: 'text', question: 'Step 4 of 4: How many kilos would you like?', next: null }
  },
  completionMessage: "✅ We've collected all the required information for your purchase. Our team will contact you shortly."
};

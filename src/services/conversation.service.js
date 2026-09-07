import { pool } from '../db.js';
import { flows, mainMenu } from '../flows/index.js';

const normalize = (value) => String(value || '').trim().toLowerCase();
const optionFor = (step, input) => step.options?.find((option, index) =>
  [option.id, option.label, String(index + 1)].map(normalize).includes(normalize(input))
);

async function activeConversation(customerId) {
  const { rows } = await pool.query("SELECT * FROM conversations WHERE customer_id = $1 AND status = 'active' ORDER BY updated_at DESC LIMIT 1", [customerId]);
  return rows[0];
}

async function getFlow(id) {
  const { rows } = await pool.query('SELECT definition FROM flow_definitions WHERE id = $1 AND is_active = true', [id]);
  return rows[0]?.definition || flows[id];
}

async function saveMessage(conversationId, direction, body) {
  await pool.query('INSERT INTO conversation_messages (conversation_id, direction, body) VALUES ($1, $2, $3)', [conversationId, direction, body]);
}

export async function receiveMessage(customer, input) {
  let conversation = await activeConversation(customer.id);
  if (!conversation || ['hi', 'hello', 'menu', 'start', 'restart'].includes(normalize(input))) {
    if (conversation) await pool.query("UPDATE conversations SET status = 'abandoned', updated_at = NOW() WHERE id = $1", [conversation.id]);
    const { rows } = await pool.query("INSERT INTO conversations (customer_id, flow_id, current_step, answers) VALUES ($1, 'main_menu', 'main_menu', '{}') RETURNING *", [customer.id]);
    conversation = rows[0];
    await saveMessage(conversation.id, 'inbound', input);
    return { conversation, response: mainMenu };
  }

  await saveMessage(conversation.id, 'inbound', input);
  if (conversation.flow_id === 'main_menu') {
    const choice = optionFor(mainMenu, input);
    if (!choice) return { conversation, response: { type: 'text', question: 'Please reply with a menu option.', next: null } };
    if (choice.id === 'agent') {
      await pool.query("UPDATE conversations SET status = 'needs_agent', updated_at = NOW() WHERE id = $1", [conversation.id]);
      return { conversation, response: { type: 'text', question: 'A team member will assist you shortly.', next: null } };
    }
    const flow = await getFlow(choice.id);
    const step = flow.steps[flow.startStepId];
    const { rows } = await pool.query('UPDATE conversations SET flow_id = $1, current_step = $2, answers = $3, updated_at = NOW() WHERE id = $4 RETURNING *', [flow.id, flow.startStepId, JSON.stringify({}), conversation.id]);
    return { conversation: rows[0], response: step };
  }

  const flow = await getFlow(conversation.flow_id);
  if (!flow) throw new Error(`Unknown flow: ${conversation.flow_id}`);
  const step = flow.steps[conversation.current_step];
  let value = input;
  let nextId = step.next;
  if (step.type === 'list' || step.type === 'buttons') {
    const choice = optionFor(step, input);
    if (!choice) return { conversation, response: { ...step, question: `Please choose one of the available options.\n\n${step.question}` } };
    value = choice.value ?? choice.label;
    nextId = choice.next;
  } else if (step.validate && !step.validate(input)) {
    return { conversation, response: { type: 'text', question: step.validationMessage, next: null } };
  }
  const answers = { ...conversation.answers, [conversation.current_step]: value };
  if (!nextId) {
    await pool.query("UPDATE conversations SET answers = $1, status = 'completed', current_step = NULL, completed_at = NOW(), updated_at = NOW() WHERE id = $2", [JSON.stringify(answers), conversation.id]);
    return { conversation, response: { type: 'text', question: flow.completionMessage, next: null } };
  }
  const { rows } = await pool.query('UPDATE conversations SET answers = $1, current_step = $2, updated_at = NOW() WHERE id = $3 RETURNING *', [JSON.stringify(answers), nextId, conversation.id]);
  return { conversation: rows[0], response: flow.steps[nextId] };
}

export async function recordOutbound(conversationId, body) { await saveMessage(conversationId, 'outbound', body); }

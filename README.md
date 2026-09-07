# Agro WhatsApp Conversation Bot

Configuration-driven Node.js/Express WhatsApp Cloud API bot with PostgreSQL-backed conversation state.

## Run it

1. Copy `.env.example` to `.env`, add your PostgreSQL and Meta Cloud API credentials.
2. Create the database named in `DATABASE_URL`.
3. Run `npm install`, then `npm run db:migrate` and `npm run dev`.
4. In Meta's WhatsApp configuration, set the callback URL to `https://your-domain/webhook` and use `WHATSAPP_VERIFY_TOKEN` as the verify token. Subscribe to `messages`.

Send **Hi**, **Menu**, or **Restart** to begin. The state is stored in `conversations.current_step` and answers in `conversations.answers`.

## Adding flows

Add a flow in `src/flows/` and register it in `src/flows/index.js`. A step can be `text`, `phone`, `list`, or `buttons`; list options use `next` for conditional branching. Each text step can declare `validate` and `validationMessage`.

## Admin flow API

`PUT /admin/flows/:id` creates or updates a database-backed flow, and `GET /admin/flows` lists them. Database definitions take precedence over the built-in examples, so staff can update questions, options, validation paths, and conditional `next` steps without a deployment. Add staff authentication before making these routes public.

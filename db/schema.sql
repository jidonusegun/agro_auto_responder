CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY, phone VARCHAR(32) UNIQUE NOT NULL, profile_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS conversations (
  id BIGSERIAL PRIMARY KEY, customer_id BIGINT NOT NULL REFERENCES customers(id),
  flow_id VARCHAR(100) NOT NULL, current_step VARCHAR(100), answers JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(30) NOT NULL DEFAULT 'active', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS conversations_active_customer_idx ON conversations(customer_id, status);
CREATE TABLE IF NOT EXISTS conversation_messages (
  id BIGSERIAL PRIMARY KEY, conversation_id BIGINT NOT NULL REFERENCES conversations(id),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')), body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS flow_definitions (
  id VARCHAR(100) PRIMARY KEY, name TEXT NOT NULL, definition JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

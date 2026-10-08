-- Manifesti — extensão de cobrança (Asaas). Importe DEPOIS do schema.sql.
SET NAMES utf8mb4;

ALTER TABLE users
  ADD COLUMN cpf_cnpj VARCHAR(20) NULL AFTER email,
  ADD COLUMN phone VARCHAR(20) NULL AFTER cpf_cnpj,
  ADD COLUMN asaas_customer_id VARCHAR(40) NULL AFTER phone;

CREATE TABLE IF NOT EXISTS subscriptions (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id             INT UNSIGNED  NOT NULL,
  plan                ENUM('pro','premium') NOT NULL,
  asaas_subscription_id VARCHAR(40) NOT NULL UNIQUE,
  status              ENUM('pending','active','overdue','canceled') NOT NULL DEFAULT 'pending',
  value_cents         INT UNSIGNED  NOT NULL,
  cycle               VARCHAR(20)   NOT NULL DEFAULT 'MONTHLY',
  current_period_end  DATE          NULL,
  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sub_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- registro bruto de todo webhook recebido do Asaas, para auditoria/depuração
CREATE TABLE IF NOT EXISTS payment_events (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_type  VARCHAR(60)   NOT NULL,
  payload     JSON          NULL,
  processed   TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

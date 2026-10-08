-- Manifesti — schema MySQL para hospedagem cPanel (HostGator)
-- Importe este arquivo via phpMyAdmin, dentro do banco que você criar no cPanel.
-- Charset utf8mb4 para suportar emojis (usados nas "camadas livres" do editor).

SET NAMES utf8mb4;
SET time_zone = '-03:00';

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)      NOT NULL,
  email         VARCHAR(190)      NOT NULL UNIQUE,
  password_hash VARCHAR(255)      NOT NULL,
  api_key       CHAR(40)          NOT NULL UNIQUE,
  plan          ENUM('gratis','pro','premium','master') NOT NULL DEFAULT 'gratis',
  created_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sites (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED      NOT NULL,
  slug          VARCHAR(80)       NOT NULL UNIQUE,   -- manifesti.com.br/<slug>
  brand         VARCHAR(120)      NOT NULL DEFAULT '',
  seo_title     VARCHAR(160)      NOT NULL DEFAULT '',
  seo_desc      VARCHAR(300)      NOT NULL DEFAULT '',
  tokens        JSON              NULL,              -- cores/fontes/tema (state.tokens)
  draft_pages   JSON              NULL,              -- versão em edição (state.pages)
  live_pages    JSON              NULL,              -- versão publicada (o que o público vê)
  custom_domain VARCHAR(190)      NULL,               -- domínio próprio, quando houver
  domain_status ENUM('none','pending','verified') NOT NULL DEFAULT 'none',
  edit_token    CHAR(32)          NULL UNIQUE,         -- link de edição rápida pro cliente final (sem login)
  published_at  DATETIME          NULL,
  created_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sites_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leads (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id     INT UNSIGNED  NOT NULL,
  name        VARCHAR(120)  NOT NULL DEFAULT '',
  contact     VARCHAR(190)  NOT NULL DEFAULT '',
  source      VARCHAR(60)   NOT NULL DEFAULT '',
  device      VARCHAR(30)   NOT NULL DEFAULT '',
  button      VARCHAR(120)  NOT NULL DEFAULT '',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_leads_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
  INDEX idx_leads_site (site_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id       INT UNSIGNED  NOT NULL,
  customer_name VARCHAR(120)  NOT NULL DEFAULT '',
  items         JSON          NULL,
  type          VARCHAR(30)   NOT NULL DEFAULT 'retirada',
  total_cents   INT UNSIGNED  NOT NULL DEFAULT 0,
  status        VARCHAR(30)   NOT NULL DEFAULT 'novo',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
  INDEX idx_orders_site (site_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bookings (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id     INT UNSIGNED  NOT NULL,
  service     VARCHAR(120)  NOT NULL DEFAULT '',
  booking_date DATE         NOT NULL,
  booking_time TIME         NOT NULL,
  client_name VARCHAR(120)  NOT NULL DEFAULT '',
  client_contact VARCHAR(190) NOT NULL DEFAULT '',
  status      VARCHAR(30)   NOT NULL DEFAULT 'confirmado',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
  INDEX idx_bookings_site (site_id),
  INDEX idx_bookings_date (booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS analytics_events (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id     INT UNSIGNED  NOT NULL,
  type        VARCHAR(30)   NOT NULL,   -- 'view' | 'click' | 'share' ...
  meta        JSON          NULL,
  device      VARCHAR(30)   NOT NULL DEFAULT '',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
  INDEX idx_events_site (site_id),
  INDEX idx_events_type (type),
  INDEX idx_events_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

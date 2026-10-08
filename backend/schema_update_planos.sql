-- Para bancos JÁ criados antes dos novos planos (Grátis / Pro / Premium / Master).
-- Rode no phpMyAdmin uma única vez.
ALTER TABLE users MODIFY plan ENUM('gratis','pro','premium','master') NOT NULL DEFAULT 'gratis';
ALTER TABLE subscriptions MODIFY plan ENUM('pro','premium') NOT NULL;

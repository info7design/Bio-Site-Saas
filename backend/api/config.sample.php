<?php
/**
 * Copie este arquivo para "config.php" (mesmo diretório) e preencha com os
 * dados que o cPanel te deu em "Bancos de dados MySQL".
 * NUNCA deixe o config.php real público/versionado com a senha real.
 */
return [
  'db_host' => 'localhost',                 // quase sempre "localhost" na HostGator
  'db_name' => 'seuusuario_manifesti',      // nome do banco (prefixo do cPanel + nome)
  'db_user' => 'seuusuario_manifesti',      // usuário do banco
  'db_pass' => 'TROQUE_ESTA_SENHA',
  // E-mails que viram conta MASTER (sem limites, nunca cobrada) ao entrar/criar conta.
  'master_emails' => ['seu-email@exemplo.com'],
  'app_url' => 'https://manifesti.com.br',  // usado para montar links públicos

  // Asaas (cobranças) — pegue em asaas.com, painel → Integrações → Chave de API.
  // Use o ambiente "sandbox" pra testar sem cobrar de verdade, troque pra
  // "production" (e a chave de produção) quando estiver pronto para cobrar.
  'asaas_env'     => 'sandbox',              // 'sandbox' ou 'production'
  'asaas_api_key' => 'COLOQUE_SUA_CHAVE_ASAAS_AQUI',
  // Token que você mesmo inventa e cadastra no painel do Asaas em
  // Integrações → Webhooks → "Token de acesso". Precisa ser igual aqui e lá.
  'asaas_webhook_token' => 'TROQUE_POR_UM_TOKEN_SECRETO_SEU',

  // Domínio próprio (Premium): IP do servidor para onde o cliente aponta o DNS.
  // 'server_ip' => '108.179.193.194',
  // 'app_host'  => 'minisite.manifesti.com.br',

  // E-mails (opcional). Sem isto, usa o envio padrão da hospedagem.
  // 'support_whatsapp' => '5512992201153',   // WhatsApp do suporte (aparece nos e-mails)
  // 'mail_from'      => 'contato@manifesti.com.br',
  // 'mail_from_name' => 'Manifesti',
  // 'notify_emails'  => ['voce@exemplo.com'],   // quem recebe os avisos; padrão: master_emails
  // 'smtp' => ['host' => 'mail.manifesti.com.br', 'port' => 465, 'user' => 'contato@manifesti.com.br', 'pass' => 'SENHA_DO_E-MAIL'],
];

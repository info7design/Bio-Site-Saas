<?php
/**
 * POST /api/auth.php?action=register  { name, email, password }
 * POST /api/auth.php?action=login     { email, password }
 * → { user: {...}, api_key: "..." }
 *
 * O painel guarda o api_key (ex: localStorage) e manda em todo pedido:
 *   Authorization: Bearer <api_key>
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/mail.php';
cors();

$action = $_GET['action'] ?? '';
$in = body();

if ($action === 'register') {
  $name = trim($in['name'] ?? '');
  $email = strtolower(trim($in['email'] ?? ''));
  $pass = (string)($in['password'] ?? '');
  if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6) {
    json_error(422, 'Preencha nome, e-mail válido e senha com 6+ caracteres.');
  }
  $pdo = db();
  $st = $pdo->prepare('SELECT id FROM users WHERE email = ?');
  $st->execute([$email]);
  if ($st->fetch()) json_error(409, 'Já existe uma conta com este e-mail.');

  $hash = password_hash($pass, PASSWORD_DEFAULT);
  $apiKey = bin2hex(random_bytes(20));
  $st = $pdo->prepare('INSERT INTO users (name, email, password_hash, api_key) VALUES (?,?,?,?)');
  $st->execute([$name, $email, $hash, $apiKey]);
  $id = (int)$pdo->lastInsertId();
  $u = applyMasterPromotion(['id' => $id, 'name' => $name, 'email' => $email, 'plan' => 'gratis']);
  // e-mails depois de responder: boas-vindas para a pessoa e aviso para o dono
  afterResponse(function () use ($name, $email) {
    $url = mailSettings()['url'];
    $first = explode(' ', $name)[0];
    mailSend($email, 'Bem-vindo(a) à Manifesti, ' . $first . '!', mailLayout(
      'Bem-vindo(a), ' . $first . '!',
      '<p style="margin:0 0 12px">Sua conta está criada. Agora é só escolher um template, trocar os textos e as fotos e publicar: em poucos minutos o seu link está no ar.</p>'
      . '<p style="margin:0 0 12px"><b>Seu e-mail de acesso:</b> ' . mh($email) . '</p>'
      . '<p style="margin:0">Quando quiser mais recursos, como todos os blocos, leads e agenda, é só olhar a aba <b>Assinatura</b> no painel.</p>',
      'Abrir meu painel', $url));
    mailNotifyOwner('Novo cadastro: ' . $name, mailLayout(
      'Novo cadastro na Manifesti',
      '<p style="margin:0 0 6px"><b>Nome:</b> ' . mh($name) . '</p><p style="margin:0 0 6px"><b>E-mail:</b> ' . mh($email) . '</p><p style="margin:0"><b>Plano:</b> Grátis</p>',
      'Ver usuários', $url));
  });
  json_out(['user' => ['id' => $id, 'name' => $name, 'email' => $email, 'plan' => $u['plan']], 'api_key' => $apiKey]);

} elseif ($action === 'login') {
  $email = strtolower(trim($in['email'] ?? ''));
  $pass = (string)($in['password'] ?? '');
  $st = db()->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
  $st->execute([$email]);
  $u = $st->fetch();
  if (!$u || !password_verify($pass, $u['password_hash'])) {
    json_error(401, 'E-mail ou senha incorretos.');
  }
  $u = applyMasterPromotion($u);
  json_out(['user' => ['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'plan' => $u['plan']], 'api_key' => $u['api_key']]);

} elseif ($action === 'me') {
  $u = applyMasterPromotion(requireAuth());
  json_out(['user' => ['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'plan' => $u['plan']]]);

} else {
  json_error(400, 'Ação inválida. Use ?action=register, ?action=login ou ?action=me.');
}

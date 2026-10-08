<?php
/**
 * POST /api/billing.php?action=checkout  (autenticado)
 *   { plan: "pro", cpf_cnpj: "...", phone?: "..." }
 *   → { invoice_url: "https://..." }  — link de pagamento Asaas (cartão de crédito)
 *
 * GET  /api/billing.php?action=status   (autenticado)
 *   → { plan, subscription: {...} | null }
 *
 * POST /api/billing.php?action=webhook  (público — chamado pelo Asaas)
 *   Valida o header "asaas-access-token" contra config.php.
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/asaas.php';
require __DIR__ . '/mail.php';
cors();

$action = $_GET['action'] ?? '';
$pdo = db();
// histórico das faturas de cada cliente (criado sozinho na primeira vez)
$pdo->exec("CREATE TABLE IF NOT EXISTS invoices (
  payment_id VARCHAR(40) NOT NULL PRIMARY KEY,
  user_id INT NOT NULL,
  plan VARCHAR(12) NOT NULL DEFAULT '',
  value_cents INT NOT NULL DEFAULT 0,
  due_date VARCHAR(10) NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  url VARCHAR(255) NOT NULL DEFAULT '',
  created_mail TINYINT NOT NULL DEFAULT 0,
  paid_mail TINYINT NOT NULL DEFAULT 0,
  overdue_mail TINYINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL
)");

// R$ e ciclo de cada plano pago. O plano Grátis não gera cobrança.
// Planos: Grátis (sem cobrança, blocos básicos), Pro e Premium.
// Master é conta administradora (config.php → master_emails), nunca cobrada.
const PLAN_PRICES = [
  'pro'     => 1290,  // R$ 12,90/mês  — 1 site, 1 página, todos os blocos
  'premium' => 3490,  // R$ 34,90/mês — até 10 sites, 3 páginas em cada
];

/** Guarda a fatura e manda os e-mails (cada tipo de e-mail sai uma única vez por fatura). */
function handleInvoiceEvent(PDO $pdo, string $event, array $p, array $sub): void {
  $pid = (string)($p['id'] ?? '');
  if ($pid === '') return;
  $map = ['PAYMENT_CREATED' => 'pending', 'PAYMENT_UPDATED' => null, 'PAYMENT_CONFIRMED' => 'paid', 'PAYMENT_RECEIVED' => 'paid',
          'PAYMENT_OVERDUE' => 'overdue', 'PAYMENT_DELETED' => 'canceled', 'PAYMENT_REFUNDED' => 'refunded'];
  if (!array_key_exists($event, $map)) return;
  $st = $pdo->prepare('SELECT * FROM invoices WHERE payment_id = ?'); $st->execute([$pid]);
  $inv = $st->fetch();
  $cents = (int)round(((float)($p['value'] ?? 0)) * 100) ?: (int)$sub['value_cents'];
  $url = (string)($p['invoiceUrl'] ?? ($inv['url'] ?? ''));
  $due = (string)($p['dueDate'] ?? ($inv['due_date'] ?? ''));
  $status = $map[$event] ?? ($inv['status'] ?? 'pending');
  if (!$inv) {
    $pdo->prepare('INSERT INTO invoices (payment_id, user_id, plan, value_cents, due_date, status, url) VALUES (?,?,?,?,?,?,?)')
        ->execute([$pid, $sub['user_id'], $sub['plan'], $cents, $due, $status, $url]);
    $inv = ['payment_id' => $pid, 'created_mail' => 0, 'paid_mail' => 0, 'overdue_mail' => 0];
  } else {
    $pdo->prepare('UPDATE invoices SET value_cents = ?, due_date = ?, status = ?, url = ? WHERE payment_id = ?')->execute([$cents, $due, $status, $url, $pid]);
  }
  $row = ['payment_id' => $pid, 'plan' => $sub['plan'], 'value_cents' => $cents, 'due_date' => $due];
  $u = $pdo->prepare('SELECT name, email FROM users WHERE id = ?'); $u->execute([$sub['user_id']]);
  $user = $u->fetch(); if (!$user) return;
  $first = explode(' ', (string)$user['name'])[0];
  $who = '<p style="margin:0 0 6px"><b>Cliente:</b> ' . mh((string)$user['name']) . ' (' . mh((string)$user['email']) . ')</p><p style="margin:0"><b>Plano:</b> ' . mh(planLabel((string)$sub['plan'])) . ' · ' . moneyBr($cents) . '</p>';
  $btnPay = $url ? ['Pagar fatura', $url] : ['', ''];
  $send = [];

  if ($event === 'PAYMENT_CREATED' && !(int)$inv['created_mail']) {
    $pdo->prepare('UPDATE invoices SET created_mail = 1 WHERE payment_id = ?')->execute([$pid]);
    $send[] = [(string)$user['email'], 'Sua fatura da Manifesti: ' . moneyBr($cents),
      mailLayout('Sua fatura está pronta', '<p style="margin:0 0 4px">Olá, ' . mh($first) . '! Segue a fatura do seu plano. Você paga com cartão de crédito numa página segura do Asaas.</p>'
        . mailInvoiceCard($row, 'Em aberto', '#f59e0b'), $btnPay[0], $btnPay[1])];
    $send[] = ['__owner__', 'Nova fatura gerada: ' . $user['name'], mailLayout('Nova fatura gerada', $who . mailInvoiceCard($row, 'Em aberto', '#f59e0b'))];
  }
  if (in_array($event, ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'], true) && !(int)$inv['paid_mail']) {
    $pdo->prepare('UPDATE invoices SET paid_mail = 1, paid_at = CURRENT_TIMESTAMP WHERE payment_id = ?')->execute([$pid]);
    $send[] = [(string)$user['email'], 'Pagamento confirmado: plano ' . planLabel((string)$sub['plan']),
      mailLayout('Pagamento confirmado', '<p style="margin:0 0 4px">Obrigado, ' . mh($first) . '! Recebemos o seu pagamento e o plano <b>' . mh(planLabel((string)$sub['plan'])) . '</b> já está ativo na sua conta.</p>'
        . mailInvoiceCard($row, 'Pago', '#16a34a'), 'Abrir meu painel', mailSettings()['url'])];
    $send[] = ['__owner__', 'Pagamento recebido: ' . moneyBr($cents) . ' de ' . $user['name'], mailLayout('Pagamento recebido', $who . mailInvoiceCard($row, 'Pago', '#16a34a'))];
  }
  if ($event === 'PAYMENT_OVERDUE' && !(int)$inv['overdue_mail']) {
    $pdo->prepare('UPDATE invoices SET overdue_mail = 1 WHERE payment_id = ?')->execute([$pid]);
    $send[] = [(string)$user['email'], 'Fatura em atraso: ' . moneyBr($cents),
      mailLayout('Sua fatura venceu', '<p style="margin:0 0 4px">Olá, ' . mh($first) . '. Não identificamos o pagamento da sua fatura. Enquanto ela estiver em aberto, sua conta volta para o plano Grátis. Pague quando puder e o plano volta na hora.</p>'
        . mailInvoiceCard($row, 'Vencida', '#dc2626'), $btnPay[0], $btnPay[1])];
    $send[] = ['__owner__', 'Fatura em atraso: ' . $user['name'], mailLayout('Fatura em atraso', $who . mailInvoiceCard($row, 'Vencida', '#dc2626'))];
  }
  if ($send) afterResponse(function () use ($send) {
    foreach ($send as [$to, $subj, $html]) { if ($to === '__owner__') mailNotifyOwner($subj, $html); else mailSend($to, $subj, $html); }
  });
}

if ($action === 'checkout') {
  $user = requireAuth();
  $in = body();
  $plan = $in['plan'] ?? '';
  if (!isset(PLAN_PRICES[$plan])) json_error(422, 'Plano inválido.');
  $cpfCnpj = trim($in['cpf_cnpj'] ?? '');
  if (strlen(preg_replace('/\D/', '', $cpfCnpj)) < 11) json_error(422, 'Informe um CPF ou CNPJ válido para a cobrança.');

  $customerId = asaasEnsureCustomer($user, $cpfCnpj, $in['phone'] ?? null);

  $r = asaasRequest('POST', '/subscriptions', [
    'customer' => $customerId,
    'billingType' => 'CREDIT_CARD', // só cartão de crédito (a página do Asaas pede os dados do cartão)
    'value' => PLAN_PRICES[$plan] / 100,
    'nextDueDate' => date('Y-m-d', strtotime('+1 day')),
    'cycle' => 'MONTHLY',
    'description' => "Manifesti — plano " . ucfirst($plan),
    'externalReference' => (string)$user['id'],
  ]);
  if (!$r['ok'] || empty($r['body']['id'])) {
    json_error(502, 'Asaas recusou a assinatura: ' . json_encode($r['body']['errors'] ?? $r['body']));
  }
  $subId = $r['body']['id'];

  $pdo->prepare('INSERT INTO subscriptions (user_id, plan, asaas_subscription_id, status, value_cents) VALUES (?,?,?,?,?)
                 ON DUPLICATE KEY UPDATE plan = VALUES(plan), value_cents = VALUES(value_cents)')
      ->execute([$user['id'], $plan, $subId, 'pending', PLAN_PRICES[$plan]]);

  // busca a primeira cobrança gerada para pegar o link de pagamento
  $p = asaasRequest('GET', "/payments?subscription={$subId}&limit=1");
  $invoiceUrl = $p['body']['data'][0]['invoiceUrl'] ?? null;
  if (!$invoiceUrl) json_error(502, 'Assinatura criada, mas não encontrei o link de pagamento. Tente novamente em instantes.');

  // a primeira fatura: grava e envia os e-mails agora (o webhook do Asaas pode chegar antes da assinatura estar salva)
  if (!empty($p['body']['data'][0]['id'])) {
    handleInvoiceEvent($pdo, 'PAYMENT_CREATED', (array)$p['body']['data'][0],
      ['user_id' => $user['id'], 'plan' => $plan, 'value_cents' => PLAN_PRICES[$plan], 'asaas_subscription_id' => $subId]);
  }
  json_out(['invoice_url' => $invoiceUrl, 'subscription_id' => $subId]);
}

if ($action === 'status') {
  $user = requireAuth();
  $st = $pdo->prepare('SELECT plan, status, value_cents, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1');
  $st->execute([$user['id']]);
  json_out(['plan' => $user['plan'], 'subscription' => $st->fetch() ?: null]);
}

if ($action === 'invoices') {
  $user = requireAuth();
  $st = $pdo->prepare('SELECT payment_id, plan, value_cents, due_date, status, url, created_at, paid_at FROM invoices WHERE user_id = ? ORDER BY due_date DESC, created_at DESC LIMIT 36');
  $st->execute([$user['id']]);
  json_out(['invoices' => $st->fetchAll()]);
}

if ($action === 'webhook') {
  $c = cfg();
  $token = $_SERVER['HTTP_ASAAS_ACCESS_TOKEN'] ?? ($_SERVER['HTTP_ASAAS_ACCESS_TOKEN'.''] ?? '');
  // o Asaas envia o header exatamente como configurado no painel; aceitamos variações comuns
  $headers = function_exists('getallheaders') ? getallheaders() : [];
  foreach ($headers as $k => $v) { if (strcasecmp($k, 'asaas-access-token') === 0) $token = $v; }

  $expected = $c['asaas_webhook_token'] ?? '';
  if (!$expected || !hash_equals($expected, (string)$token)) {
    json_error(401, 'Token de webhook inválido.');
  }

  $in = body();
  $event = $in['event'] ?? '';
  $pdo->prepare('INSERT INTO payment_events (event_type, payload) VALUES (?,?)')
      ->execute([$event, json_encode($in)]);

  $subId = $in['payment']['subscription'] ?? null;
  if ($subId) {
    $st = $pdo->prepare('SELECT * FROM subscriptions WHERE asaas_subscription_id = ?');
    $st->execute([$subId]);
    $sub = $st->fetch();

    if ($sub) {
      handleInvoiceEvent($pdo, $event, (array)($in['payment'] ?? []), $sub);
      $activeEvents = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'];
      $downgradeEvents = ['PAYMENT_OVERDUE', 'PAYMENT_DELETED', 'PAYMENT_REFUNDED', 'SUBSCRIPTION_DELETED'];

      if (in_array($event, $activeEvents, true)) {
        $pdo->prepare('UPDATE subscriptions SET status = "active" WHERE id = ?')->execute([$sub['id']]);
        $pdo->prepare('UPDATE users SET plan = ? WHERE id = ? AND plan != "master"')->execute([$sub['plan'], $sub['user_id']]);
      } elseif (in_array($event, $downgradeEvents, true)) {
        $status = $event === 'SUBSCRIPTION_DELETED' ? 'canceled' : 'overdue';
        $pdo->prepare('UPDATE subscriptions SET status = ? WHERE id = ?')->execute([$status, $sub['id']]);
        $pdo->prepare('UPDATE users SET plan = "gratis" WHERE id = ? AND plan != "master"')->execute([$sub['user_id']]);
      }
    }
  }

  json_out(['ok' => true]);
}

json_error(400, 'Ação inválida. Use ?action=checkout, ?action=status ou ?action=webhook.');

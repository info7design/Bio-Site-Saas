<?php
/**
 * GET /api/admin.php?action=users   (só conta MASTER)
 * Lista quem se cadastrou e quem está com site ativo (publicado).
 * Nunca devolve senha nem chave de API.
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/mail.php';
cors();

$user = requireAuth();
if (!isMasterUser($user)) json_error(403, 'Área exclusiva da conta master.');
$pdo = db();

// excluir a conta de um usuário (e todos os sites dele). Não vale para contas master.
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_GET['action'] ?? '') === 'delete_user') {
  $id = (int)($_GET['id'] ?? 0);
  $st = $pdo->prepare('SELECT id, email, plan FROM users WHERE id = ?'); $st->execute([$id]);
  $t = $st->fetch();
  if (!$t) json_error(404, 'Usuário não encontrado.');
  if ((int)$t['id'] === (int)$user['id'] || $t['plan'] === 'master') json_error(403, 'Contas master não podem ser excluídas por aqui.');
  $pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
  $dir = dirname(__DIR__) . '/uploads/' . $id;
  if (is_dir($dir)) { foreach (glob($dir . '/*') ?: [] as $f) { if (is_file($f)) @unlink($f); } @rmdir($dir); }
  json_out(['ok' => true]);
}
// e-mail de teste para o próprio master (confere se o envio funciona)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_GET['action'] ?? '') === 'test_mail') {
  $ok = mailSend((string)$user['email'], 'Teste de e-mail da Manifesti', mailLayout('Está funcionando', '<p style="margin:0">Este é um e-mail de teste. Se ele chegou na sua caixa de entrada (e não no spam), os avisos de cadastro e de fatura vão chegar normalmente.</p>'));
  json_out(['ok' => $ok, 'to' => $user['email'], 'message' => $ok ? 'E-mail enviado para ' . $user['email'] . '. Confira a caixa de entrada e o spam.' : 'Não foi possível enviar. Veja as configurações de e-mail.']);
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') json_error(405, 'Método não suportado.');
$users = $pdo->query("SELECT u.id, u.name, u.email, u.plan, u.created_at,
    (SELECT COUNT(*) FROM sites s WHERE s.user_id = u.id) AS sites_total,
    (SELECT COUNT(*) FROM sites s WHERE s.user_id = u.id AND s.published_at IS NOT NULL) AS sites_published,
    (SELECT MAX(s.updated_at) FROM sites s WHERE s.user_id = u.id) AS last_activity,
    (SELECT COUNT(*) FROM analytics_events e JOIN sites s ON s.id = e.site_id
       WHERE s.user_id = u.id AND e.type = 'view') AS views
  FROM users u ORDER BY u.created_at DESC, u.id DESC LIMIT 5000")->fetchAll();

$pub = []; $all = [];
foreach ($pdo->query("SELECT id, user_id, slug, brand, published_at, updated_at FROM sites ORDER BY updated_at DESC")->fetchAll() as $r) {
  $row = ['id' => (int)$r['id'], 'slug' => $r['slug'], 'brand' => $r['brand'], 'published_at' => $r['published_at'], 'updated_at' => $r['updated_at']];
  $all[$r['user_id']][] = $row;
  if ($r['published_at']) $pub[$r['user_id']][] = $row;
}

$byPlan = ['gratis' => 0, 'pro' => 0, 'premium' => 0, 'master' => 0];
$withSite = 0; $week = 0; $limit = strtotime('-7 days');
foreach ($users as &$u) {
  $u['id'] = (int)$u['id'];
  $u['sites_total'] = (int)$u['sites_total'];
  $u['sites_published'] = (int)$u['sites_published'];
  $u['views'] = (int)$u['views'];
  $u['published'] = $pub[$u['id']] ?? [];
  $u['sites'] = $all[$u['id']] ?? [];
  if (isset($byPlan[$u['plan']])) $byPlan[$u['plan']]++;
  if ($u['sites_published'] > 0) $withSite++;
  if (strtotime((string)$u['created_at']) >= $limit) $week++;
}
unset($u);

json_out([
  'summary' => ['total' => count($users), 'with_active_site' => $withSite, 'last_7_days' => $week, 'by_plan' => $byPlan],
  'users' => $users,
]);

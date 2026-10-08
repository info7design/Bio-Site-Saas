<?php
/**
 * POST /api/orders.php  { slug, customer_name, items:[...], type, total_cents }  (público — bloco Cardápio)
 * GET  /api/orders.php?site_id=5                                                  (autenticado — painel)
 * PUT  /api/orders.php?id=9                { status }                             (autenticado — mudar status)
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
cors();
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $in = body();
  $slug = trim($in['slug'] ?? '');
  if (!$slug) json_error(422, 'slug é obrigatório.');
  $st = $pdo->prepare('SELECT id FROM sites WHERE slug = ?');
  $st->execute([$slug]);
  $site = $st->fetch();
  if (!$site) json_error(404, 'Site não encontrado.');

  $st = $pdo->prepare('INSERT INTO orders (site_id, customer_name, items, type, total_cents) VALUES (?,?,?,?,?)');
  $st->execute([
    $site['id'],
    substr(trim($in['customer_name'] ?? ''), 0, 120),
    json_encode($in['items'] ?? []),
    substr(trim($in['type'] ?? 'retirada'), 0, 30),
    (int)($in['total_cents'] ?? 0),
  ]);
  json_out(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $user = requireAuth();
  $site = requireOwnedSite($user, (int)($_GET['site_id'] ?? 0));
  $st = $pdo->prepare('SELECT * FROM orders WHERE site_id = ? ORDER BY created_at DESC LIMIT 200');
  $st->execute([$site['id']]);
  json_out(['orders' => $st->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['id'])) {
  $user = requireAuth();
  $in = body();
  $status = trim($in['status'] ?? '');
  if (!$status) json_error(422, 'status é obrigatório.');
  // confirma que o pedido pertence a um site do usuário autenticado
  $st = $pdo->prepare('SELECT o.id FROM orders o JOIN sites s ON s.id = o.site_id WHERE o.id = ? AND s.user_id = ?');
  $st->execute([(int)$_GET['id'], $user['id']]);
  if (!$st->fetch()) json_error(404, 'Pedido não encontrado.');
  $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, (int)$_GET['id']]);
  json_out(['ok' => true]);
}

json_error(405, 'Método não suportado.');

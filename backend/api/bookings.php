<?php
/**
 * GET  /api/bookings.php?slug=joao&date=2026-10-10         (público — ver horários livres)
 * POST /api/bookings.php  { slug, service, date, time, client_name, client_contact }  (público — confirmar)
 * GET  /api/bookings.php?site_id=5                                                     (autenticado — painel)
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
cors();
$pdo = db();

function siteByHandle(PDO $pdo, string $slug): array {
  $st = $pdo->prepare('SELECT id FROM sites WHERE slug = ?');
  $st->execute([$slug]);
  $s = $st->fetch();
  if (!$s) json_error(404, 'Site não encontrado.');
  return $s;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['slug'])) {
  $site = siteByHandle($pdo, trim($_GET['slug']));
  $date = $_GET['date'] ?? date('Y-m-d');
  $st = $pdo->prepare('SELECT booking_time FROM bookings WHERE site_id = ? AND booking_date = ? AND status != "cancelado"');
  $st->execute([$site['id'], $date]);
  $taken = array_map(fn($r) => substr($r['booking_time'], 0, 5), $st->fetchAll());

  $slots = [];
  for ($h = 8; $h < 18; $h++) {
    foreach (['00', '50'] as $m) {
      $t = sprintf('%02d:%s', $h, $m);
      if (!in_array($t, $taken, true)) $slots[] = $t;
    }
  }
  json_out(['date' => $date, 'slots' => $slots, 'taken' => array_values($taken)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $in = body();
  $slug = trim($in['slug'] ?? '');
  if (!$slug) json_error(422, 'slug é obrigatório.');
  $site = siteByHandle($pdo, $slug);

  $date = $in['date'] ?? ''; $time = $in['time'] ?? '';
  if (!$date || !$time) json_error(422, 'date e time são obrigatórios.');

  $st = $pdo->prepare('SELECT id FROM bookings WHERE site_id=? AND booking_date=? AND booking_time=? AND status != "cancelado"');
  $st->execute([$site['id'], $date, $time]);
  if ($st->fetch()) json_error(409, 'Esse horário acabou de ser reservado. Escolha outro.');

  $st = $pdo->prepare('INSERT INTO bookings (site_id, service, booking_date, booking_time, client_name, client_contact) VALUES (?,?,?,?,?,?)');
  $st->execute([
    $site['id'],
    substr(trim($in['service'] ?? ''), 0, 120),
    $date, $time,
    substr(trim($in['client_name'] ?? ''), 0, 120),
    substr(trim($in['client_contact'] ?? ''), 0, 190),
  ]);
  json_out(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['site_id'])) {
  $user = requireAuth();
  $site = requireOwnedSite($user, (int)$_GET['site_id']);
  $st = $pdo->prepare('SELECT * FROM bookings WHERE site_id = ? ORDER BY booking_date DESC, booking_time DESC LIMIT 200');
  $st->execute([$site['id']]);
  json_out(['bookings' => $st->fetchAll()]);
}

json_error(405, 'Método não suportado.');

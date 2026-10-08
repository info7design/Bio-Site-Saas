<?php
/**
 * POST /api/leads.php   { slug, name, contact, source, device, button }  (público — formulário do site)
 * GET  /api/leads.php?site_id=5                                          (autenticado — painel do dono)
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

  $st = $pdo->prepare('INSERT INTO leads (site_id, name, contact, source, device, button) VALUES (?,?,?,?,?,?)');
  $st->execute([
    $site['id'],
    substr(trim($in['name'] ?? ''), 0, 120),
    substr(trim($in['contact'] ?? ''), 0, 190),
    substr(trim($in['source'] ?? 'site'), 0, 60),
    substr(trim($in['device'] ?? ''), 0, 30),
    substr(trim($in['button'] ?? ''), 0, 120),
  ]);
  json_out(['ok' => true], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $user = requireAuth();
  $site = requireOwnedSite($user, (int)($_GET['site_id'] ?? 0));
  $st = $pdo->prepare('SELECT * FROM leads WHERE site_id = ? ORDER BY created_at DESC LIMIT 200');
  $st->execute([$site['id']]);
  json_out(['leads' => $st->fetchAll()]);
}

json_error(405, 'Método não suportado.');

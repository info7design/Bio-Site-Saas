<?php
/**
 * POST /api/events.php  { slug, type, button?, device? }   (público — registra visita/clique)
 * GET  /api/events.php?site_id=5&days=14                   (autenticado — resumo pro dashboard)
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
cors();
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $in = body();
  $slug = trim($in['slug'] ?? '');
  $type = trim($in['type'] ?? 'view');
  if (!$slug) json_error(422, 'slug é obrigatório.');
  $st = $pdo->prepare('SELECT id FROM sites WHERE slug = ?');
  $st->execute([$slug]);
  $site = $st->fetch();
  if (!$site) json_error(404, 'Site não encontrado.');

  $st = $pdo->prepare('INSERT INTO analytics_events (site_id, type, meta, device) VALUES (?,?,?,?)');
  $st->execute([
    $site['id'],
    substr($type, 0, 30),
    json_encode(['button' => $in['button'] ?? null, 'ref' => substr((string)($in['ref'] ?? ''), 0, 60)]),
    substr($in['device'] ?? '', 0, 30),
  ]);
  json_out(['ok' => true], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $user = requireAuth();
  $site = requireOwnedSite($user, (int)($_GET['site_id'] ?? 0));
  $days = max(1, min(90, (int)($_GET['days'] ?? 14)));
  $since = date('Y-m-d 00:00:00', strtotime('-' . ($days - 1) . ' days'));

  // visitas e cliques por dia
  $st = $pdo->prepare("SELECT DATE(created_at) d, type, COUNT(*) c FROM analytics_events
                       WHERE site_id = ? AND created_at >= ?
                       GROUP BY DATE(created_at), type ORDER BY d ASC");
  $st->execute([$site['id'], $since]);
  $rows = $st->fetchAll();

  // aparelhos (só visitas)
  $st = $pdo->prepare("SELECT device, COUNT(*) c FROM analytics_events
                       WHERE site_id = ? AND type = 'view' AND created_at >= ?
                       GROUP BY device ORDER BY c DESC");
  $st->execute([$site['id'], $since]);
  $devices = [];
  foreach ($st->fetchAll() as $r) $devices[] = [$r['device'] !== '' ? $r['device'] : 'Outro', (int)$r['c']];

  // botões mais clicados e origem das visitas (lidos do campo meta)
  $st = $pdo->prepare("SELECT type, meta FROM analytics_events
                       WHERE site_id = ? AND type IN ('click','view') AND created_at >= ?
                       ORDER BY id DESC LIMIT 20000");
  $st->execute([$site['id'], $since]);
  $buttons = []; $sources = [];
  foreach ($st->fetchAll() as $r) {
    $m = json_decode((string)$r['meta'], true) ?: [];
    if ($r['type'] === 'click') {
      $b = trim((string)($m['button'] ?? ''));
      if ($b !== '') $buttons[$b] = ($buttons[$b] ?? 0) + 1;
    } else {
      $ref = strtolower(trim((string)($m['ref'] ?? '')));
      $ref = preg_replace('/^www\./', '', $ref);
      if ($ref === '') $label = 'Direto';
      elseif (strpos($ref, 'instagram') !== false) $label = 'Instagram';
      elseif (strpos($ref, 'wa.me') !== false || strpos($ref, 'whatsapp') !== false) $label = 'WhatsApp';
      elseif (strpos($ref, 'tiktok') !== false) $label = 'TikTok';
      elseif (strpos($ref, 'youtube') !== false || strpos($ref, 'youtu.be') !== false) $label = 'YouTube';
      elseif (strpos($ref, 'google') !== false) $label = 'Google';
      elseif (strpos($ref, 'facebook') !== false || strpos($ref, 'fb.') !== false) $label = 'Facebook';
      else $label = $ref;
      $sources[$label] = ($sources[$label] ?? 0) + 1;
    }
  }
  arsort($buttons); arsort($sources);
  $top = function ($a) { $o = []; foreach (array_slice($a, 0, 6, true) as $k => $v) $o[] = [(string)$k, (int)$v]; return $o; };

  json_out(['days' => $days, 'today' => date('Y-m-d'), 'rows' => $rows, 'devices' => $devices, 'buttons' => $top($buttons), 'sources' => $top($sources)]);
}

json_error(405, 'Método não suportado.');

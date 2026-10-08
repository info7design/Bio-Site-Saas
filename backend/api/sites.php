<?php
/**
 * GET  /api/sites.php                 (autenticado) → lista os sites do usuário
 * GET  /api/sites.php?id=5            (autenticado) → um site (versão de edição)
 * GET  /api/sites.php?slug=joao       (público, sem auth) → versão PUBLICADA, pro site ao vivo
 * POST /api/sites.php                 (autenticado) → cria site { slug, brand }
 * PUT  /api/sites.php?id=5            (autenticado) → salva rascunho { tokens, pages, seo_title, seo_desc, brand }
 * POST /api/sites.php?id=5&action=publish (autenticado) → copia draft_pages → live_pages
 * POST /api/sites.php?id=5&action=edit_link (autenticado) → gera/renova o link de edição rápida
 * POST /api/sites.php?id=5&action=unpublish (autenticado) → tira o site do ar
 * POST /api/sites.php?id=5&action=delete    (autenticado) → exclui o site
 * GET  /api/sites.php?edit_token=XXX  (público) → abre o editor restrito deste site, sem login
 * PUT  /api/sites.php?edit_token=XXX  (público) → salva rascunho via link de edição rápida
 * POST /api/sites.php?edit_token=XXX&action=publish (público) → publica via link de edição rápida
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
cors();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = db();

// ---- rota pública: renderizar o site publicado por slug (sem login) ----
if ($method === 'GET' && isset($_GET['slug'])) {
  $slug = trim($_GET['slug']);
  $st = $pdo->prepare('SELECT s.id, s.slug, s.brand, s.seo_title, s.seo_desc, s.tokens, s.live_pages, s.published_at, u.plan
                       FROM sites s JOIN users u ON u.id = s.user_id WHERE s.slug = ? LIMIT 1');
  $st->execute([$slug]);
  $site = $st->fetch();
  if (!$site || !$site['published_at']) json_error(404, 'Site não encontrado ou ainda não publicado.');
  json_out([
    'slug' => $site['slug'],
    'brand' => $site['brand'],
    'plan' => $site['plan'],
    'seo_title' => $site['seo_title'],
    'seo_desc' => $site['seo_desc'],
    'tokens' => json_decode($site['tokens'] ?? 'null'),
    'pages' => json_decode($site['live_pages'] ?? 'null'),
  ]);
}

// ---- rota pública: link de edição rápida pro cliente final (sem login) ----
// Dá acesso só ao rascunho/publicação DESTE site, nunca à conta ou a outros sites.
if (isset($_GET['edit_token'])) {
  $tok = trim($_GET['edit_token']);
  $st = $pdo->prepare('SELECT * FROM sites WHERE edit_token = ? LIMIT 1');
  $st->execute([$tok]);
  $site = $st->fetch();
  if (!$site) json_error(404, 'Link de edição inválido ou expirado.');

  if ($method === 'GET') {
    json_out([
      'slug' => $site['slug'],
      'brand' => $site['brand'],
      'tokens' => json_decode($site['tokens'] ?? 'null'),
      'pages' => json_decode($site['draft_pages'] ?? 'null'),
      'published_at' => $site['published_at'],
    ]);
  }
  if ($method === 'PUT') {
    $in = body();
    $fields = []; $params = [];
    if (array_key_exists('tokens', $in)) { $fields[] = 'tokens = ?'; $params[] = json_encode($in['tokens']); }
    if (array_key_exists('pages', $in)) {
      $ow = $pdo->prepare('SELECT plan FROM users WHERE id = ?'); $ow->execute([$site['user_id']]);
      enforcePlanOnPages($in['pages'], (string)($ow->fetch()['plan'] ?? 'gratis'));
      $fields[] = 'draft_pages = ?'; $params[] = json_encode($in['pages']);
    }
    if (!$fields) json_error(422, 'Nada para salvar.');
    $params[] = $site['id'];
    $pdo->prepare('UPDATE sites SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
    json_out(['ok' => true]);
  }
  if ($method === 'POST' && ($_GET['action'] ?? '') === 'publish') {
    $pdo->prepare('UPDATE sites SET live_pages = draft_pages, published_at = NOW() WHERE id = ?')->execute([$site['id']]);
    json_out(['ok' => true, 'published_at' => date('Y-m-d H:i:s')]);
  }
  json_error(405, 'Método não suportado para este link.');
}

// ---- todo o resto exige login ----
$user = requireAuth();

if ($method === 'GET' && isset($_GET['id'])) {
  $site = requireOwnedSite($user, (int)$_GET['id']);
  json_out([
    'id' => (int)$site['id'],
    'slug' => $site['slug'],
    'brand' => $site['brand'],
    'seo_title' => $site['seo_title'],
    'seo_desc' => $site['seo_desc'],
    'tokens' => json_decode($site['tokens'] ?? 'null'),
    'pages' => json_decode($site['draft_pages'] ?? 'null'),
    'published_at' => $site['published_at'],
    'custom_domain' => $site['custom_domain'],
    'domain_status' => $site['domain_status'],
    'edit_token' => $site['edit_token'],
  ]);
}

if ($method === 'GET') {
  $st = $pdo->prepare('SELECT id, slug, brand, published_at, updated_at FROM sites WHERE user_id = ? ORDER BY updated_at DESC');
  $st->execute([$user['id']]);
  json_out(['sites' => $st->fetchAll()]);
}

if ($method === 'POST' && ($_GET['action'] ?? '') === 'publish') {
  $site = requireOwnedSite($user, (int)($_GET['id'] ?? 0));
  $st = $pdo->prepare('UPDATE sites SET live_pages = draft_pages, published_at = NOW() WHERE id = ?');
  $st->execute([$site['id']]);
  json_out(['ok' => true, 'published_at' => date('Y-m-d H:i:s')]);
}

// gera (ou renova) o link de edição rápida — o dono manda esse link pro cliente final
if ($method === 'POST' && ($_GET['action'] ?? '') === 'edit_link') {
  $site = requireOwnedSite($user, (int)($_GET['id'] ?? 0));
  $token = bin2hex(random_bytes(16));
  $pdo->prepare('UPDATE sites SET edit_token = ? WHERE id = ?')->execute([$token, $site['id']]);
  json_out(['edit_token' => $token, 'edit_url' => cfg()['app_url'] . '/editar.html?t=' . $token]);
}

// tirar do ar: o site deixa de abrir para o público, mas o rascunho continua salvo
if ($method === 'POST' && ($_GET['action'] ?? '') === 'unpublish') {
  $site = requireOwnedSite($user, (int)($_GET['id'] ?? 0));
  $pdo->prepare('UPDATE sites SET published_at = NULL WHERE id = ?')->execute([$site['id']]);
  json_out(['ok' => true]);
}

// excluir o site de vez (leads, pedidos, agenda e estatísticas dele também são apagados)
if (($method === 'DELETE' && isset($_GET['id'])) || ($method === 'POST' && ($_GET['action'] ?? '') === 'delete')) {
  $site = requireOwnedSite($user, (int)($_GET['id'] ?? 0));
  $pdo->prepare('DELETE FROM sites WHERE id = ?')->execute([$site['id']]);
  json_out(['ok' => true]);
}

if ($method === 'POST') {
  $in = body();
  $slug = preg_replace('/[^a-z0-9-]/', '', strtolower(trim($in['slug'] ?? '')));
  $brand = trim($in['brand'] ?? '');
  if (!$slug || !$brand) json_error(422, 'Informe slug e nome do site.');
  // nomes que conflitam com páginas/pastas do próprio sistema
  if (in_array($slug, ['api','admin','app','entrar','login','criar-conta','planos','editar','index','www','uploads','painel','assets','suporte'], true)) {
    json_error(422, 'Esse endereço é reservado. Escolha outro.');
  }

  $st = $pdo->prepare('SELECT id FROM sites WHERE slug = ?');
  $st->execute([$slug]);
  if ($st->fetch()) json_error(409, 'Esse endereço (slug) já está em uso.');

  // limite de sites por plano: Grátis 1, Pro 1, Premium 10, Master sem limite
  $st = $pdo->prepare('SELECT COUNT(*) c FROM sites WHERE user_id = ?');
  $st->execute([$user['id']]);
  $count = (int)$st->fetch()['c'];
  $limit = planLimits($user['plan'])['sites'];
  if ($count >= $limit) json_error(403, 'Limite de sites do seu plano atingido (' . $limit . '). Faça upgrade para criar mais.');

  $editToken = bin2hex(random_bytes(16));
  $st = $pdo->prepare('INSERT INTO sites (user_id, slug, brand, seo_title, draft_pages, edit_token) VALUES (?,?,?,?,?,?)');
  $st->execute([$user['id'], $slug, $brand, $brand, json_encode([]), $editToken]);
  json_out(['id' => (int)$pdo->lastInsertId(), 'slug' => $slug, 'edit_token' => $editToken], 201);
}

if ($method === 'PUT' && isset($_GET['id'])) {
  $site = requireOwnedSite($user, (int)$_GET['id']);
  $in = body();
  $fields = []; $params = [];
  foreach (['brand' => 's', 'seo_title' => 's', 'seo_desc' => 's'] as $k => $_) {
    if (array_key_exists($k, $in)) { $fields[] = "$k = ?"; $params[] = (string)$in[$k]; }
  }
  $ownerPlan = sitePlanOf($site, $user);
  if (array_key_exists('pages', $in)) enforcePlanOnPages($in['pages'], $ownerPlan);
  // plano Grátis não usa Pixel/GA/música: descarta esses extras no servidor
  if (planLimits($ownerPlan)['restricted_blocks'] && isset($in['tokens']['x'])) unset($in['tokens']['x']);
  foreach (['tokens', 'pages'] as $k) {
    if (array_key_exists($k, $in)) {
      $col = $k === 'pages' ? 'draft_pages' : 'tokens';
      $fields[] = "$col = ?"; $params[] = json_encode($in[$k]);
    }
  }
  if (!$fields) json_error(422, 'Nada para salvar.');
  $params[] = $site['id'];
  $pdo->prepare('UPDATE sites SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
  json_out(['ok' => true]);
}

json_error(405, 'Método não suportado.');

<?php
/**
 * Domínio próprio (plano Premium).
 *
 * GET  /api/domains.php?resolve=meusite.com.br   público  → { slug } se o domínio está ATIVO
 * GET  /api/domains.php?site_id=3                login    → estado do domínio do site + instruções de DNS
 * POST /api/domains.php            { site_id, domain }   → cadastra (status pending). Só Premium/Master.
 * POST /api/domains.php?action=verify  { site_id }       → confere o DNS (pending → dns_ok)
 * POST /api/domains.php?action=remove  { site_id }       → remove o domínio do site
 * GET  /api/domains.php?action=list                      → (master) todos os domínios
 * POST /api/domains.php?action=set_status { site_id, status } → (master) pending | dns_ok | active
 *
 * Fluxo: pending → (cliente aponta o DNS) → dns_ok → (master cria o alias no cPanel) → active.
 * A tabela é criada sozinha na primeira chamada; não precisa rodar SQL.
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
cors();

$pdo = db();
$pdo->exec("CREATE TABLE IF NOT EXISTS site_domains (
  domain     VARCHAR(190) NOT NULL PRIMARY KEY,
  site_id    INT          NOT NULL,
  status     VARCHAR(12)  NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  checked_at TIMESTAMP    NULL
)");

$c = cfg();
$serverIp = (string)($c['server_ip'] ?? '108.179.193.194');
$appHost  = (string)($c['app_host'] ?? 'minisite.manifesti.com.br');
$method   = $_SERVER['REQUEST_METHOD'];
$action   = $_GET['action'] ?? '';

function cleanDomain(string $d): string {
  $d = strtolower(trim($d));
  $d = preg_replace('#^https?://#', '', $d);
  $d = preg_replace('#[/?\#].*$#', '', $d);
  $d = preg_replace('/^www\./', '', $d);
  return rtrim($d, '.');
}
function validDomain(string $d): bool {
  return (bool)preg_match('/^(?=.{4,190}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/', $d);
}
/** IPs/CNAMEs que o domínio resolve hoje. (config 'dns_stub' existe só para testes.) */
function dnsLookup(string $d): array {
  $stub = cfg()['dns_stub'] ?? null;
  if (is_array($stub)) return $stub[$d] ?? [];
  $out = [];
  $r = @dns_get_record($d, DNS_A | DNS_CNAME);
  foreach (is_array($r) ? $r : [] as $x) {
    if (($x['type'] ?? '') === 'A') $out[] = $x['ip'];
    if (($x['type'] ?? '') === 'CNAME') $out[] = strtolower((string)$x['target']);
  }
  return $out;
}
function domainRow(PDO $pdo, int $siteId): ?array {
  $st = $pdo->prepare('SELECT domain, status, created_at, checked_at FROM site_domains WHERE site_id = ?');
  $st->execute([$siteId]);
  return $st->fetch() ?: null;
}
function instructions(string $domain, string $ip, string $host): array {
  $parts = explode('.', $domain);
  $cc = ['com.br','net.br','org.br','gov.br','edu.br','art.br','eco.br','emp.br','ind.br','inf.br','tec.br','blog.br','app.br','dev.br'];
  $rootLabels = in_array(implode('.', array_slice($parts, -2)), $cc, true) ? 3 : 2;
  $isSub = count($parts) > $rootLabels;
  return [
    'server_ip' => $ip,
    'record_type' => 'A',
    'record_name' => $isSub ? implode('.', array_slice($parts, 0, count($parts) - $rootLabels)) : '@',
    'record_value' => $ip,
    'is_subdomain' => $isSub,
  ];
}
function premiumOwner(array $site, array $user): bool {
  $plan = sitePlanOf($site, $user);
  return in_array($plan, ['premium', 'master'], true);
}

// ---- público: qual site responde por este domínio? ----
if ($method === 'GET' && isset($_GET['resolve'])) {
  $d = cleanDomain((string)$_GET['resolve']);
  // só responde se o dono ainda estiver no Premium (ou Master): quem sai do plano perde o domínio próprio
  $st = $pdo->prepare("SELECT s.slug FROM site_domains d JOIN sites s ON s.id = d.site_id JOIN users u ON u.id = s.user_id
                       WHERE d.domain = ? AND d.status = 'active' AND u.plan IN ('premium','master') LIMIT 1");
  $st->execute([$d]);
  $r = $st->fetch();
  if (!$r) json_error(404, 'Domínio não encontrado.');
  json_out(['slug' => $r['slug']]);
}

$user = requireAuth();

// ---- master: lista e troca de status ----
if ($action === 'list') {
  if (!isMasterUser($user)) json_error(403, 'Área exclusiva da conta master.');
  $rows = $pdo->query("SELECT d.domain, d.status, d.created_at, d.checked_at, s.id AS site_id, s.slug, s.brand, u.email, u.name
                       FROM site_domains d JOIN sites s ON s.id = d.site_id JOIN users u ON u.id = s.user_id
                       ORDER BY d.created_at DESC")->fetchAll();
  json_out(['domains' => $rows, 'server_ip' => $serverIp, 'app_host' => $appHost]);
}
if ($action === 'set_status' && $method === 'POST') {
  if (!isMasterUser($user)) json_error(403, 'Área exclusiva da conta master.');
  $in = body(); $st = (string)($in['status'] ?? '');
  if (!in_array($st, ['pending', 'dns_ok', 'active'], true)) json_error(422, 'Status inválido.');
  $row = domainRow($pdo, (int)($in['site_id'] ?? 0));
  if (!$row) json_error(404, 'Este site não tem domínio cadastrado.');
  $pdo->prepare('UPDATE site_domains SET status = ? WHERE domain = ?')->execute([$st, $row['domain']]);
  json_out(['ok' => true, 'status' => $st]);
}

// ---- estado do domínio de um site ----
if ($method === 'GET') {
  $site = requireOwnedSite($user, (int)($_GET['site_id'] ?? 0));
  $row = domainRow($pdo, (int)$site['id']);
  $out = ['allowed' => premiumOwner($site, $user), 'domain' => $row, 'server_ip' => $serverIp, 'app_host' => $appHost];
  if ($row) $out['instructions'] = instructions($row['domain'], $serverIp, $appHost);
  json_out($out);
}
if ($method !== 'POST') json_error(405, 'Método não suportado.');

$in = body();
$site = requireOwnedSite($user, (int)($in['site_id'] ?? 0));
$sid = (int)$site['id'];

if ($action === 'remove') {
  $pdo->prepare('DELETE FROM site_domains WHERE site_id = ?')->execute([$sid]);
  json_out(['ok' => true]);
}

if (!premiumOwner($site, $user)) json_error(403, 'Domínio próprio está disponível no plano Premium.');

if ($action === 'verify') {
  $row = domainRow($pdo, $sid);
  if (!$row) json_error(404, 'Cadastre o domínio primeiro.');
  $found = dnsLookup($row['domain']);
  $ok = in_array($serverIp, $found, true) || in_array($appHost, $found, true);
  $status = $row['status'];
  if ($ok && $status === 'pending') $status = 'dns_ok';
  if (!$ok && $status === 'dns_ok') $status = 'pending';
  $pdo->prepare('UPDATE site_domains SET status = ?, checked_at = CURRENT_TIMESTAMP WHERE domain = ?')->execute([$status, $row['domain']]);
  json_out(['ok' => $ok, 'status' => $status, 'found' => $found,
            'message' => $ok
              ? ($status === 'active' ? 'Tudo certo: seu domínio já está no ar.' : 'O apontamento está correto. Estamos ativando o domínio no servidor; isso costuma levar até algumas horas.')
              : 'Ainda não encontramos o apontamento. Confira o registro e tente de novo; pode levar de alguns minutos a algumas horas para valer.']);
}

// cadastrar / trocar o domínio do site
$d = cleanDomain((string)($in['domain'] ?? ''));
if (!validDomain($d)) json_error(422, 'Domínio inválido. Use algo como meunegocio.com.br (sem https:// e sem barras).');
if ($d === 'manifesti.com.br' || substr($d, -strlen('.manifesti.com.br')) === '.manifesti.com.br') {
  json_error(422, 'Esse endereço pertence à Manifesti. Informe o seu próprio domínio.');
}
$st = $pdo->prepare('SELECT site_id FROM site_domains WHERE domain = ?'); $st->execute([$d]);
$ex = $st->fetch();
if ($ex && (int)$ex['site_id'] !== $sid) json_error(409, 'Este domínio já está conectado a outro site.');
$pdo->prepare('DELETE FROM site_domains WHERE site_id = ?')->execute([$sid]);
$pdo->prepare("INSERT INTO site_domains (domain, site_id, status) VALUES (?, ?, 'pending')")->execute([$d, $sid]);
json_out(['ok' => true, 'domain' => domainRow($pdo, $sid), 'instructions' => instructions($d, $serverIp, $appHost)], 201);

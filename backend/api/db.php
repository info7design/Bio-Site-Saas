<?php
/**
 * Conexão PDO + helpers compartilhados por todos os endpoints.
 * Nenhuma dependência externa — só PHP puro (funciona em qualquer cPanel).
 */
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0'); // nunca mostrar erro de PHP cru pro público

function cfg(): array {
  static $cfg = null;
  if ($cfg === null) {
    $path = __DIR__ . '/config.php';
    if (!file_exists($path)) {
      json_error(500, 'config.php não encontrado. Copie config.sample.php para config.php e preencha os dados do banco.');
    }
    $cfg = require $path;
  }
  return $cfg;
}

function db(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    $c = cfg();
    $dsn = "mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4";
    try {
      $pdo = new PDO($dsn, $c['db_user'], $c['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      ]);
    } catch (PDOException $e) {
      json_error(500, 'Não foi possível conectar ao banco. Confira config.php.');
    }
  }
  return $pdo;
}

function cors(): void {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Content-Type: application/json; charset=utf-8');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

function body(): array {
  $raw = file_get_contents('php://input');
  if (!$raw) return [];
  $d = json_decode($raw, true);
  return is_array($d) ? $d : [];
}

function json_out($data, int $code = 200): void {
  http_response_code($code);
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function json_error(int $code, string $msg): void {
  http_response_code($code);
  echo json_encode(['error' => $msg], JSON_UNESCAPED_UNICODE);
  exit;
}

/** Exige Authorization: Bearer <api_key> e devolve o usuário dono da chave. */
function requireAuth(): array {
  // Em hospedagem cPanel (PHP via CGI/FastCGI) o Apache nem sempre repassa o
  // cabeçalho Authorization; tentamos todas as formas conhecidas.
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  if (!$hdr && function_exists('getallheaders')) {
    foreach (getallheaders() as $k => $v) { if (strcasecmp($k, 'Authorization') === 0) { $hdr = $v; break; } }
  }
  if (!preg_match('/Bearer\s+(.+)/i', $hdr, $m)) {
    json_error(401, 'Faça login novamente (token ausente).');
  }
  $key = trim($m[1]);
  $st = db()->prepare('SELECT * FROM users WHERE api_key = ? LIMIT 1');
  $st->execute([$key]);
  $user = $st->fetch();
  if (!$user) json_error(401, 'Sessão inválida. Faça login novamente.');
  return $user;
}

/** Confirma que o site pertence ao usuário autenticado; interrompe se não. */
/** Conta master de verdade: plano master E e-mail listado em config.php → master_emails. */
function isMasterUser(array $u): bool {
  $list = array_map('strtolower', cfg()['master_emails'] ?? []);
  return ($u['plan'] ?? '') === 'master' && in_array(strtolower((string)($u['email'] ?? '')), $list, true);
}

/** Site do próprio usuário. A conta master pode abrir/gerenciar o site de qualquer usuário. */
function requireOwnedSite(array $user, int $siteId): array {
  if (isMasterUser($user)) {
    $st = db()->prepare('SELECT * FROM sites WHERE id = ? LIMIT 1');
    $st->execute([$siteId]);
  } else {
    $st = db()->prepare('SELECT * FROM sites WHERE id = ? AND user_id = ? LIMIT 1');
    $st->execute([$siteId, $user['id']]);
  }
  $site = $st->fetch();
  if (!$site) json_error(404, 'Site não encontrado.');
  return $site;
}

/** Plano do dono de um site (para aplicar os limites do dono, não de quem está editando). */
function sitePlanOf(array $site, array $editor): string {
  if ((int)$site['user_id'] === (int)$editor['id']) return (string)$editor['plan'];
  $st = db()->prepare('SELECT plan FROM users WHERE id = ?');
  $st->execute([$site['user_id']]);
  return (string)($st->fetch()['plan'] ?? 'gratis');
}

/** Limites de cada plano. Master = conta administradora (sem limites práticos). */
const PLAN_LIMITS = [
  'gratis'  => ['sites' => 1,   'pages' => 1, 'restricted_blocks' => true,  'pro_features' => false],
  'pro'     => ['sites' => 1,   'pages' => 1, 'restricted_blocks' => false, 'pro_features' => true],
  'premium' => ['sites' => 10,  'pages' => 3, 'restricted_blocks' => false, 'pro_features' => true],
  'master'  => ['sites' => 999, 'pages' => 3, 'restricted_blocks' => false, 'pro_features' => true],
];
/** Blocos liberados no plano Grátis (os demais aparecem travados no editor). */
const FREE_BLOCKS = ['CoverBlock','ProfileBlock','HeadlineBlock','LabelRow','ButtonBlock','IconGrid','TextBlock','GalleryBlock','WhatsAppBlock','MapBlock','SocialBlock','DividerBlock','FooterBlock'];

function planLimits(string $plan): array { return PLAN_LIMITS[$plan] ?? PLAN_LIMITS['gratis']; }

/** Valida páginas/blocos contra o plano do dono do site. Interrompe com 403 se passar do limite. */
function enforcePlanOnPages($pages, string $plan): void {
  if (!is_array($pages)) return;
  $lim = planLimits($plan);
  if (count($pages) > $lim['pages']) {
    json_error(403, $lim['pages'] === 1
      ? 'Seu plano permite 1 página por site. Faça upgrade para o Premium (3 páginas por site).'
      : 'Limite de ' . $lim['pages'] . ' páginas por site.');
  }
  if ($lim['restricted_blocks']) {
    foreach ($pages as $pg) {
      foreach (($pg['blocks'] ?? []) as $b) {
        if (!in_array($b['type'] ?? '', FREE_BLOCKS, true)) {
          json_error(403, 'Este site usa blocos do plano Pro. Faça upgrade para publicar.');
        }
      }
    }
  }
}

/** Promove a conta a master se o e-mail estiver em config.php → master_emails. */
function applyMasterPromotion(array $user): array {
  $list = array_map('strtolower', cfg()['master_emails'] ?? []);
  if (in_array(strtolower($user['email']), $list, true) && $user['plan'] !== 'master') {
    db()->prepare('UPDATE users SET plan = ? WHERE id = ?')->execute(['master', $user['id']]);
    $user['plan'] = 'master';
  }
  return $user;
}

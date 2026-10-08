<?php
/**
 * POST /api/upload.php   (autenticado, multipart/form-data, campo "file")
 *   → { url: "https://manifesti.com.br/uploads/12/ab12cd....jpg" }
 *
 * Aceita imagem (todos os planos), áudio e vídeo (planos Pro/Premium/Master).
 * O tipo é conferido pelo CONTEÚDO do arquivo (finfo), não pelo nome/extensão
 * que o navegador manda, e o nome final é sempre aleatório. SVG e qualquer
 * arquivo executável são recusados.
 */
declare(strict_types=1);
require __DIR__ . '/db.php';
cors();

// "128M" → bytes
function ini_bytes(string $v): int {
  $v = trim($v); if ($v === '') return 0;
  $n = (float)$v; $u = strtolower(substr($v, -1));
  return (int)($u === 'g' ? $n * 1073741824 : ($u === 'm' ? $n * 1048576 : ($u === 'k' ? $n * 1024 : $n)));
}
function human_size(int $b): string {
  return $b >= 1048576 ? round($b / 1048576, 1) . ' MB' : max(1, (int)round($b / 1024)) . ' KB';
}
// limite por tipo de arquivo (em MB) conforme o plano
function upload_limits_mb(string $plan): array {
  return [
    'gratis'  => ['image' => 5,  'audio' => 0,  'video' => 0],
    'pro'     => ['image' => 15, 'audio' => 30, 'video' => 100],
    'premium' => ['image' => 20, 'audio' => 50, 'video' => 200],
    'master'  => ['image' => 50, 'audio' => 100, 'video' => 500],
  ][$plan] ?? ['image' => 5, 'audio' => 0, 'video' => 0];
}
// o servidor (PHP) também tem um teto próprio: o menor entre upload_max_filesize e post_max_size
function server_cap(): int {
  $a = ini_bytes((string)ini_get('upload_max_filesize')); $b = ini_bytes((string)ini_get('post_max_size'));
  return ($a && $b) ? min($a, $b) : max($a, $b);
}

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $lim = upload_limits_mb($user['plan']);
  json_out(['limits_mb' => $lim, 'server_cap' => human_size(server_cap()), 'server_cap_bytes' => server_cap()]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error(405, 'Método não suportado.');

// arquivo maior que post_max_size: o PHP descarta tudo e $_FILES chega vazio
if (empty($_FILES) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
  json_error(413, 'O servidor só aceita arquivos de até ' . human_size(server_cap()) . '. Envie um arquivo menor ou peça para aumentar o limite do servidor.');
}
if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
  $code = $_FILES['file']['error'] ?? -1;
  if ($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE) {
    json_error(413, 'O servidor só aceita arquivos de até ' . human_size(server_cap()) . '. Envie um arquivo menor ou peça para aumentar o limite do servidor.');
  }
  json_error(422, 'Nenhum arquivo recebido.');
}
$f = $_FILES['file'];
if (!is_uploaded_file($f['tmp_name'])) json_error(422, 'Upload inválido.');

// tipo real → [extensão, categoria]  (o limite de tamanho vem do plano)
const UPLOAD_TYPES = [
  'image/jpeg'      => ['jpg', 'image'],
  'image/png'       => ['png', 'image'],
  'image/webp'      => ['webp', 'image'],
  'image/gif'       => ['gif', 'image'],
  'audio/mpeg'      => ['mp3', 'audio'],
  'audio/ogg'       => ['ogg', 'audio'],
  'audio/wav'       => ['wav', 'audio'],
  'audio/x-wav'     => ['wav', 'audio'],
  'audio/mp4'       => ['m4a', 'audio'],
  'audio/x-m4a'     => ['m4a', 'audio'],
  'video/mp4'       => ['mp4', 'video'],
  'video/webm'      => ['webm', 'video'],
];

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
if (!isset(UPLOAD_TYPES[$mime])) {
  json_error(415, 'Tipo de arquivo não aceito. Use JPG, PNG, WebP, GIF, MP3, M4A, OGG, WAV, MP4 ou WebM.');
}
[$ext, $cat] = UPLOAD_TYPES[$mime];
$maxMb = upload_limits_mb($user['plan'])[$cat];
$max = $maxMb * 1048576;

if ($cat !== 'image' && ($maxMb === 0 || !planLimits($user['plan'])['pro_features'])) {
  json_error(403, 'Envio de áudio e vídeo está disponível a partir do plano Pro.');
}
if ($f['size'] > $max) {
  json_error(413, 'Arquivo grande demais (limite do seu plano: ' . $maxMb . ' MB para ' . ($cat === 'image' ? 'fotos' : ($cat === 'audio' ? 'músicas' : 'vídeos')) . ').');
}
if ($cat === 'image' && @getimagesize($f['tmp_name']) === false) json_error(415, 'Imagem inválida.');

// cota de espaço por conta: Grátis 50 MB · Pro 1 GB · Premium 5 GB · Master 20 GB
$quota = ['gratis' => 50, 'pro' => 1024, 'premium' => 5120, 'master' => 20480][$user['plan']] ?? 50;
$dir = dirname(__DIR__) . '/uploads/' . (int)$user['id'];
if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) json_error(500, 'Não foi possível criar a pasta de envio.');
$used = 0;
foreach (glob($dir . '/*') ?: [] as $existing) { $used += (int)@filesize($existing); }
if ($used + $f['size'] > $quota * 1048576) {
  json_error(403, 'Seu espaço de arquivos (' . $quota . ' MB) acabou. Remova arquivos ou faça upgrade.');
}

$name = bin2hex(random_bytes(12)) . '.' . $ext;
if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $name)) json_error(500, 'Falha ao salvar o arquivo.');

json_out(['url' => rtrim(cfg()['app_url'], '/') . '/uploads/' . (int)$user['id'] . '/' . $name, 'type' => $cat], 201);

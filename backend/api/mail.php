<?php
/**
 * Envio de e-mails da Manifesti (sem dependências).
 *
 * Por padrão usa a função mail() da própria hospedagem (HostGator já vem pronta).
 * Se existir 'smtp' no config.php, envia por SMTP autenticado (mais confiável).
 *
 * config.php (todas opcionais):
 *   'mail_from'      => 'contato@manifesti.com.br',
 *   'mail_from_name' => 'Manifesti',
 *   'notify_emails'  => ['voce@exemplo.com'],   // quem recebe os avisos (padrão: master_emails)
 *   'smtp' => ['host'=>'mail.manifesti.com.br','port'=>465,'user'=>'contato@manifesti.com.br','pass'=>'...'],
 *   'mail_dry_run'   => '/caminho/arquivo.log'  // só para testes: grava em vez de enviar
 */
declare(strict_types=1);

function mailSettings(): array {
  $c = cfg();
  return [
    'from'   => (string)($c['mail_from'] ?? 'contato@manifesti.com.br'),
    'name'   => (string)($c['mail_from_name'] ?? 'Manifesti'),
    'notify' => array_values(array_filter((array)($c['notify_emails'] ?? $c['master_emails'] ?? []))),
    'smtp'   => is_array($c['smtp'] ?? null) ? $c['smtp'] : null,
    'dry'    => $c['mail_dry_run'] ?? null,
    'url'    => rtrim((string)($c['app_url'] ?? 'https://minisite.manifesti.com.br'), '/'),
  ];
}

function mailEncodeHeader(string $s): string {
  return preg_match('/[^\x20-\x7E]/', $s) ? '=?UTF-8?B?' . base64_encode($s) . '?=' : $s;
}

/** Monta a mensagem MIME (texto + HTML). Devolve [cabeçalhos, corpo]. */
function mailBuild(string $to, string $subject, string $html, string $replyTo = ''): array {
  $m = mailSettings();
  $b = 'mf_' . bin2hex(random_bytes(8));
  $text = trim(html_entity_decode(strip_tags(preg_replace('#<(br|/p|/tr|/h\d|/div)>#i', "\n", $html)), ENT_QUOTES, 'UTF-8'));
  $text = preg_replace("/\n{3,}/", "\n\n", preg_replace('/[ \t]+/', ' ', $text));
  $h = [
    'From: ' . mailEncodeHeader($m['name']) . ' <' . $m['from'] . '>',
    'To: ' . $to,
    'Subject: ' . mailEncodeHeader($subject),
    'Date: ' . date('r'),
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . (explode('@', $m['from'])[1] ?? 'manifesti.com.br') . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $b . '"',
  ];
  if ($replyTo) $h[] = 'Reply-To: ' . $replyTo;
  $body = "--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($text))
        . "--$b\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html))
        . "--$b--\r\n";
  return [$h, $body];
}

function smtpRead($fp): array {
  $code = 0; $all = '';
  while (($line = fgets($fp, 1024)) !== false) {
    $all .= $line; $code = (int)substr($line, 0, 3);
    if (strlen($line) < 4 || $line[3] !== '-') break;
  }
  return [$code, $all];
}
function smtpCmd($fp, string $cmd, array $ok): bool {
  fwrite($fp, $cmd . "\r\n");
  [$code] = smtpRead($fp);
  return in_array($code, $ok, true);
}
function smtpSend(array $smtp, string $from, string $to, array $headers, string $body): bool {
  $port = (int)($smtp['port'] ?? 465);
  $host = (string)($smtp['host'] ?? 'localhost');
  $secure = $port === 465 ? 'ssl://' : '';
  $fp = @stream_socket_client($secure . $host . ':' . $port, $en, $es, 10, STREAM_CLIENT_CONNECT, stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]));
  if (!$fp) return false;
  stream_set_timeout($fp, 12);
  try {
    [$c] = smtpRead($fp); if ($c !== 220) return false;
    $ehlo = 'EHLO ' . (parse_url((string)(cfg()['app_url'] ?? ''), PHP_URL_HOST) ?: 'manifesti.com.br');
    if (!smtpCmd($fp, $ehlo, [250])) return false;
    if ($port === 587) {
      if (!smtpCmd($fp, 'STARTTLS', [220])) return false;
      if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) return false;
      if (!smtpCmd($fp, $ehlo, [250])) return false;
    }
    if (!empty($smtp['user'])) {
      if (!smtpCmd($fp, 'AUTH LOGIN', [334])) return false;
      if (!smtpCmd($fp, base64_encode((string)$smtp['user']), [334])) return false;
      if (!smtpCmd($fp, base64_encode((string)($smtp['pass'] ?? '')), [235])) return false;
    }
    if (!smtpCmd($fp, 'MAIL FROM:<' . $from . '>', [250])) return false;
    if (!smtpCmd($fp, 'RCPT TO:<' . $to . '>', [250, 251])) return false;
    if (!smtpCmd($fp, 'DATA', [354])) return false;
    $data = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    $data = preg_replace('/^\./m', '..', str_replace("\r\n", "\n", $data));
    $data = str_replace("\n", "\r\n", $data);
    fwrite($fp, $data . "\r\n.\r\n");
    [$c] = smtpRead($fp);
    @smtpCmd($fp, 'QUIT', [221]);
    return $c === 250;
  } finally { @fclose($fp); }
}

/** Envia um e-mail HTML. Nunca lança erro: devolve true/false. */
function mailSend(string $to, string $subject, string $html, string $replyTo = ''): bool {
  try {
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) return false;
    $m = mailSettings();
    [$h, $body] = mailBuild($to, $subject, $html, $replyTo);
    if ($m['dry']) {
      file_put_contents((string)$m['dry'], "=== " . date('c') . " → $to\n" . implode("\n", $h) . "\n\n" . $body . "\n", FILE_APPEND);
      return true;
    }
    if ($m['smtp']) return smtpSend($m['smtp'], $m['from'], $to, $h, $body);
    // mail() da hospedagem: cabeçalhos próprios (sem To/Subject, que o mail() monta)
    $hdr = array_values(array_filter($h, fn($x) => !preg_match('/^(To|Subject):/i', $x)));
    return @mail($to, mailEncodeHeader($subject), $body, implode("\r\n", $hdr), '-f' . $m['from']);
  } catch (Throwable $e) {
    error_log('mailSend: ' . $e->getMessage());
    return false;
  }
}

/** Avisa o dono da plataforma (todos os e-mails em notify_emails / master_emails). */
function mailNotifyOwner(string $subject, string $html): void {
  foreach (mailSettings()['notify'] as $to) mailSend((string)$to, $subject, $html);
}

/** Roda depois de responder ao navegador, para o envio de e-mail não atrasar a resposta. */
function afterResponse(callable $fn): void {
  register_shutdown_function(function () use ($fn) {
    if (function_exists('fastcgi_finish_request')) @fastcgi_finish_request();
    try { $fn(); } catch (Throwable $e) { error_log('afterResponse: ' . $e->getMessage()); }
  });
}

// ───────────────────────── visual dos e-mails ─────────────────────────
function mh(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
function moneyBr(int $cents): string { return 'R$ ' . number_format($cents / 100, 2, ',', '.'); }
function dateBr(string $d): string { $t = strtotime($d); return $t ? date('d/m/Y', $t) : $d; }
function planLabel(string $p): string { return ['pro' => 'Pro', 'premium' => 'Premium', 'gratis' => 'Grátis', 'master' => 'Master'][$p] ?? ucfirst($p); }

/** Moldura de todos os e-mails: cabeçalho com a marca, cartão branco, rodapé. */
/** WhatsApp do suporte (só números, com DDI). Pode trocar em config.php: 'support_whatsapp'. */
function supportWhats(): string {
  $n = preg_replace('/\D+/', '', (string)(cfg()['support_whatsapp'] ?? '5512992201153'));
  return $n ?: '5512992201153';
}
function mailLayout(string $title, string $inner, string $btnLabel = '', string $btnUrl = ''): string {
  $url = mailSettings()['url'];
  $btn = $btnLabel && $btnUrl
    ? '<tr><td style="padding:6px 32px 30px"><a href="' . mh($btnUrl) . '" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:14px">' . mh($btnLabel) . '</a></td></tr>'
    : '';
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . mh($title) . '</title></head>'
  . '<body style="margin:0;padding:0;background:#f3f1fb;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#1b1630">'
  . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1fb"><tr><td align="center" style="padding:28px 14px">'
  . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">'
  . '<tr><td style="background:#7c3aed;background-image:linear-gradient(135deg,#7c3aed,#d946a8);border-radius:22px 22px 0 0;padding:26px 32px">'
  .   '<table role="presentation" cellpadding="0" cellspacing="0"><tr>'
  .   '<td style="width:38px;height:38px;background:#ffffff;border-radius:11px;text-align:center;font-weight:800;font-size:20px;color:#7c3aed;line-height:38px">M</td>'
  .   '<td style="padding-left:12px;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-.3px">manifesti</td></tr></table></td></tr>'
  . '<tr><td style="background:#ffffff"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
  .   '<tr><td style="padding:30px 32px 8px;font-size:24px;font-weight:800;line-height:1.25;color:#1b1630">' . mh($title) . '</td></tr>'
  .   '<tr><td style="padding:0 32px 18px;font-size:15.5px;line-height:1.6;color:#4a4560">' . $inner . '</td></tr>'
  .   $btn
  . '</table></td></tr>'
  . '<tr><td style="background:#ffffff;border-radius:0 0 22px 22px;border-top:1px solid #eee9fb;padding:18px 32px 24px;font-size:12.5px;line-height:1.6;color:#8a84a3">'
  .   'Manifesti · seu negócio em um link que vende<br>Precisa de ajuda? <a href="https://wa.me/' . mh(supportWhats()) . '" style="color:#16a34a;font-weight:700;text-decoration:none">Fale com o suporte no WhatsApp</a><br><a href="' . mh($url) . '" style="color:#7c3aed;text-decoration:none">' . mh(preg_replace('#^https?://#', '', $url)) . '</a>'
  . '</td></tr></table></td></tr></table></body></html>';
}

/** Linha "rótulo — valor" dentro do cartão da fatura. */
function mailRow(string $label, string $value): string {
  return '<tr><td style="padding:9px 0;border-top:1px solid #eee9fb;font-size:14px;color:#8a84a3">' . mh($label) . '</td>'
       . '<td style="padding:9px 0;border-top:1px solid #eee9fb;font-size:14px;font-weight:700;color:#1b1630;text-align:right">' . $value . '</td></tr>';
}

/** Cartão de fatura (usado nos e-mails de fatura, pagamento e atraso). */
function mailInvoiceCard(array $inv, string $statusText, string $statusColor): string {
  $num = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', (string)$inv['payment_id']), -8));
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 4px;border:1px solid #e6e0f7;border-radius:16px;background:#faf8ff"><tr><td style="padding:20px 22px">'
   . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
   .   '<td style="font-size:13px;color:#8a84a3;text-transform:uppercase;letter-spacing:.08em">Fatura #' . mh($num) . '</td>'
   .   '<td style="text-align:right"><span style="display:inline-block;background:' . $statusColor . ';color:#ffffff;font-size:12px;font-weight:700;padding:4px 11px;border-radius:99px">' . mh($statusText) . '</span></td></tr></table>'
   . '<div style="font-size:34px;font-weight:800;letter-spacing:-.5px;color:#1b1630;margin:10px 0 4px">' . moneyBr((int)$inv['value_cents']) . '</div>'
   . '<div style="font-size:14px;color:#4a4560;margin-bottom:10px">Plano ' . mh(planLabel((string)$inv['plan'])) . ' · mensal</div>'
   . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
   .   mailRow('Vencimento', mh(dateBr((string)$inv['due_date'])))
   .   mailRow('Formas de pagamento', 'Cartão de crédito')
   . '</table></td></tr></table>';
}

<?php
/**
 * Cliente mínimo da API do Asaas (sem dependências — só cURL).
 * Docs: https://docs.asaas.com/reference
 */
declare(strict_types=1);

function asaasBase(): string {
  $c = cfg();
  $env = $c['asaas_env'] ?? 'sandbox';
  return $env === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3';
}

/**
 * Chamada genérica à API do Asaas.
 * @throws nada — devolve ['ok'=>bool,'status'=>int,'body'=>array] sempre.
 */
function asaasRequest(string $method, string $path, array $data = null): array {
  $c = cfg();
  $key = $c['asaas_api_key'] ?? '';
  if (!$key) json_error(500, 'asaas_api_key não configurada em config.php.');

  $ch = curl_init(asaasBase() . $path);
  $headers = [
    'Content-Type: application/json',
    'access_token: ' . $key,
    'User-Agent: manifesti-biosite',
  ];
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_TIMEOUT        => 20,
  ]);
  if ($data !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
  $resp = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);

  if ($resp === false) return ['ok' => false, 'status' => 0, 'body' => ['error' => $err]];
  $body = json_decode($resp, true) ?? [];
  return ['ok' => $status >= 200 && $status < 300, 'status' => $status, 'body' => $body];
}

/** Garante um customer no Asaas para este usuário (cria se ainda não existir). */
function asaasEnsureCustomer(array $user, string $cpfCnpj, ?string $phone): string {
  if (!empty($user['asaas_customer_id'])) return $user['asaas_customer_id'];

  $r = asaasRequest('POST', '/customers', [
    'name' => $user['name'],
    'email' => $user['email'],
    'cpfCnpj' => preg_replace('/\D/', '', $cpfCnpj),
    'mobilePhone' => $phone ? preg_replace('/\D/', '', $phone) : null,
    'externalReference' => (string)$user['id'],
  ]);
  if (!$r['ok'] || empty($r['body']['id'])) {
    json_error(422, 'Não foi possível validar os dados de cobrança: ' . json_encode($r['body']['errors'] ?? $r['body']));
  }
  $customerId = $r['body']['id'];
  db()->prepare('UPDATE users SET asaas_customer_id = ?, cpf_cnpj = ?, phone = ? WHERE id = ?')
      ->execute([$customerId, $cpfCnpj, $phone, $user['id']]);
  return $customerId;
}

<?php

declare(strict_types=1);

namespace Puid;

/**
 * Official PHP client for the PUID API — the Provably Unique IDentifier service.
 * Every id is guaranteed distinct by construction (a counter run through a 128-bit
 * permutation), not by the dice roll a random UUID makes.
 *
 * Provide exactly one credential:
 *
 *     $puid = new Puid\Client(apiKey: 'puid_live_...');
 *     $puid = new Puid\Client(accessToken: 'puid_at_...');
 */
final class Client
{
    public const DEFAULT_ENDPOINT = 'https://puid.dev/api';

    private string $endpoint;

    /** @var array{0: string, 1: string} [headerName, headerValue] */
    private array $authHeader;

    /**
     * @param string $endpoint API endpoint (default DEFAULT_ENDPOINT). Point it at a
     *                          local dev server for tests, or your own domain for a
     *                          self-hosted (Enterprise) PUID.
     */
    public function __construct(
        ?string $apiKey = null,
        ?string $accessToken = null,
        string $endpoint = self::DEFAULT_ENDPOINT,
    ) {
        if ($apiKey !== null && $accessToken !== null) {
            throw new PuidError('provide either apiKey or accessToken, not both');
        }
        if ($apiKey === null && $accessToken === null) {
            throw new PuidError('provide an apiKey (puid_live_...) or an accessToken (puid_at_...)');
        }

        $this->endpoint = rtrim($endpoint, '/');
        $this->authHeader = $accessToken !== null
            ? ['Authorization', 'Bearer ' . $accessToken]
            : ['X-API-Key', (string) $apiKey];
    }

    /**
     * Generate $count ids (1–10).
     *
     * @return list<string>
     */
    public function ids(int $count = 1): array
    {
        if ($count < 1 || $count > 10) {
            throw new PuidError('count must be between 1 and 10', null, 'invalid_count');
        }

        /** @var list<string> $ids */
        $ids = $this->get('/v1/ids?n=' . $count)['ids'];

        return $ids;
    }

    /** Generate a single id. */
    public function id(): string
    {
        return $this->ids(1)[0];
    }

    /**
     * Decode a PUID back to the counter value it encodes. Returned as a decimal
     * string, since the value can exceed PHP's 64-bit integer range.
     */
    public function ordinal(string $puid): string
    {
        if ($puid === '') {
            throw new PuidError('puid must be a non-empty string', null, 'invalid_puid');
        }

        return (string) $this->get('/v1/ordinal/' . rawurlencode($puid))['ordinal'];
    }

    /**
     * Today's usage and remaining daily quota. Does not spend an id.
     *
     * @return array<string, mixed>
     */
    public function quota(): array
    {
        return $this->get('/v1/quota');
    }

    /**
     * Exchange OAuth2 client credentials for a bearer token and return a ready
     * client. This is how an app generates ids on a team's behalf without ever
     * handling the team's API key.
     */
    public static function fromClientCredentials(
        string $clientId,
        string $clientSecret,
        string $scope = 'puid:generate',
        string $endpoint = self::DEFAULT_ENDPOINT,
    ): self {
        if ($clientId === '' || $clientSecret === '') {
            throw new PuidError('clientId and clientSecret are required', null, 'invalid_client');
        }

        $base = rtrim($endpoint, '/');
        [$status, $body] = self::request(
            'POST',
            $base . '/oauth/token',
            ['Content-Type: application/x-www-form-urlencoded', 'Accept: application/json'],
            http_build_query([
                'grant_type' => 'client_credentials',
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'scope' => $scope,
            ]),
        );
        $data = self::parseJson($body);
        if ($status < 200 || $status >= 300 || empty($data['access_token'])) {
            throw new PuidError(
                self::str($data['error_description'] ?? $data['error'] ?? null) ?? "token request failed with HTTP {$status}",
                $status,
                self::str($data['error'] ?? null),
            );
        }

        return new self(accessToken: (string) $data['access_token'], endpoint: $endpoint);
    }

    /**
     * @return array<string, mixed>
     */
    private function get(string $path): array
    {
        [$status, $body] = self::request(
            'GET',
            $this->endpoint . $path,
            [$this->authHeader[0] . ': ' . $this->authHeader[1], 'Accept: application/json'],
            null,
        );
        $data = self::parseJson($body);
        if ($status < 200 || $status >= 300) {
            throw new PuidError(
                self::str($data['message'] ?? $data['error'] ?? null) ?? "request failed with HTTP {$status}",
                $status,
                self::str($data['error'] ?? null),
            );
        }

        return $data;
    }

    /**
     * @param  list<string>          $headers
     * @return array{0: int, 1: string} [statusCode, responseBody]
     */
    private static function request(string $method, string $url, array $headers, ?string $body): array
    {
        $ch = curl_init($url);
        if ($ch === false) {
            throw new PuidError('could not initialize curl', null, 'network_error');
        }
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
        ]);
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        }
        $resp = curl_exec($ch);
        if ($resp === false) {
            $err = curl_error($ch);
            throw new PuidError('request to PUID failed: ' . $err, null, 'network_error');
        }
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);

        return [$status, (string) $resp];
    }

    /**
     * @return array<string, mixed>
     */
    private static function parseJson(string $str): array
    {
        $data = json_decode($str, true);

        return is_array($data) ? $data : [];
    }

    private static function str(mixed $value): ?string
    {
        return is_string($value) ? $value : null;
    }
}

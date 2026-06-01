<?php

declare(strict_types=1);

namespace Puid\Tests;

use PHPUnit\Framework\TestCase;
use Puid\Client;
use Puid\PuidError;

/**
 * Integration suite for the PHP client — runs against a REAL PUID instance.
 *
 * Point it at a running server with PUID_ENDPOINT (default http://localhost:8799/api,
 * i.e. `npm run dev:e2e` from the repo root). The site origin (for dev-login + the
 * dashboard API used to mint keys) is derived by stripping the trailing /api, or set
 * PUID_ORIGIN explicitly.
 *
 * Everything a real endpoint can produce is tested live: id generation, decoding,
 * quota, 401, 402 (out of quota), 429 (one per second), and the OAuth2
 * client-credentials flow. Two cases a live endpoint never produces are exercised
 * differently: a non-JSON error body (a short-lived `php -S` server) and a transport
 * failure (a real connection to a closed port). When the server is unreachable the
 * live tests skip.
 */
final class ClientTest extends TestCase
{
    private static function endpoint(): string
    {
        return rtrim(getenv('PUID_ENDPOINT') ?: 'http://localhost:8799/api', '/');
    }

    private static function origin(): string
    {
        $origin = getenv('PUID_ORIGIN');
        if (is_string($origin) && $origin !== '') {
            return rtrim($origin, '/');
        }

        return (string) preg_replace('#/api$#', '', self::endpoint());
    }

    private static function serverUp(): bool
    {
        $ch = curl_init(self::endpoint() . '/openapi.json');
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 5]);
        $ok = curl_exec($ch) !== false && (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE) === 200;

        return $ok;
    }

    private function requireServer(): void
    {
        if (!self::serverUp()) {
            $this->markTestSkipped('PUID not reachable at ' . self::endpoint() . '; run `npm run dev:e2e`');
        }
    }

    private function uniqEmail(string $tag): string
    {
        return $tag . '-' . bin2hex(random_bytes(6)) . '@example.com';
    }

    private function caught(callable $fn): PuidError
    {
        try {
            $fn();
        } catch (PuidError $e) {
            return $e;
        }
        $this->fail('expected a PuidError');
    }

    /** @return array<string, mixed> */
    private function postJson(string $url, array $payload, ?string $cookieJar): array
    {
        $ch = curl_init($url);
        $opts = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
            CURLOPT_POSTFIELDS => json_encode($payload),
        ];
        if ($cookieJar !== null) {
            $opts[CURLOPT_COOKIEFILE] = $cookieJar;
            $opts[CURLOPT_COOKIEJAR] = $cookieJar;
        }
        curl_setopt_array($ch, $opts);
        $resp = curl_exec($ch);
        $data = json_decode((string) $resp, true);

        return is_array($data) ? $data : [];
    }

    // dev-login (gated by ALLOW_DEV_LOGIN) returns a 302 + session cookie; curl does
    // not follow redirects by default, so the cookie lands in the jar.
    private function devCookieJar(string $email): string
    {
        $jar = (string) tempnam(sys_get_temp_dir(), 'puidck');
        $ch = curl_init(self::origin() . '/auth/dev-login?email=' . rawurlencode($email) . '&next=/dashboard');
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_COOKIEJAR => $jar, CURLOPT_COOKIEFILE => $jar]);
        curl_exec($ch);

        return $jar;
    }

    private function mintKey(string $jar): string
    {
        return (string) $this->postJson(self::origin() . '/dashboard/api/team/keys', ['label' => 'php-test'], $jar)['api_key'];
    }

    private function seedUsage(string $jar, int $count): void
    {
        $ch = curl_init(self::origin() . '/dashboard/api/dev/seed-usage?n=' . $count);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_COOKIEFILE => $jar, CURLOPT_COOKIEJAR => $jar]);
        curl_exec($ch);
    }

    /** @return array{0: string, 1: string} */
    private function registerClient(string $name): array
    {
        $body = $this->postJson(
            self::endpoint() . '/oauth/register',
            ['client_name' => $name, 'redirect_uris' => ['https://example.test/cb']],
            null,
        );

        return [(string) $body['client_id'], (string) $body['client_secret']];
    }

    // --- real service ---------------------------------------------------------

    public function testIdsUnique(): void
    {
        $this->requireServer();
        $key = $this->mintKey($this->devCookieJar($this->uniqEmail('ids')));
        $ids = (new Client(apiKey: $key, endpoint: self::endpoint()))->ids(10);
        $this->assertCount(10, $ids);
        $this->assertCount(10, array_unique($ids));
        foreach ($ids as $id) {
            $this->assertNotSame('', $id);
        }
    }

    public function testIdSingle(): void
    {
        $this->requireServer();
        $key = $this->mintKey($this->devCookieJar($this->uniqEmail('single')));
        $this->assertNotSame('', (new Client(apiKey: $key, endpoint: self::endpoint()))->id());
    }

    public function testOrdinalConsecutive(): void
    {
        $this->requireServer();
        $key = $this->mintKey($this->devCookieJar($this->uniqEmail('ord')));
        $client = new Client(apiKey: $key, endpoint: self::endpoint());
        $ids = $client->ids(2); // one rate-limited request; ordinal is not rate limited
        $a = $client->ordinal($ids[0]);
        $b = $client->ordinal($ids[1]);
        $this->assertGreaterThan(0, (int) $a);
        $this->assertSame(1, (int) $b - (int) $a);
    }

    public function testEndpointTrailingSlash(): void
    {
        $this->requireServer();
        $key = $this->mintKey($this->devCookieJar($this->uniqEmail('slash')));
        $this->assertNotSame('', (new Client(apiKey: $key, endpoint: self::endpoint() . '/'))->id());
    }

    public function testQuotaDoesNotSpend(): void
    {
        $this->requireServer();
        $key = $this->mintKey($this->devCookieJar($this->uniqEmail('quota')));
        $client = new Client(apiKey: $key, endpoint: self::endpoint());
        $before = $client->quota();
        $after = $client->quota();
        $this->assertIsString($before['plan']);
        $this->assertSame($before['used'], $after['used']);
    }

    public function testBadKey401(): void
    {
        $this->requireServer();
        $client = new Client(apiKey: 'puid_live_definitely_not_real', endpoint: self::endpoint());
        $err = $this->caught(fn () => $client->id());
        $this->assertSame(401, $err->status);
        $this->assertSame('unauthorized', $err->errorCode);
    }

    public function testQuotaExceeded402(): void
    {
        $this->requireServer();
        $jar = $this->devCookieJar($this->uniqEmail('over-quota'));
        $this->seedUsage($jar, 1000); // free plan = 1000/day
        $client = new Client(apiKey: $this->mintKey($jar), endpoint: self::endpoint());
        $this->assertSame(402, $this->caught(fn () => $client->id())->status);
    }

    public function testRateLimit429(): void
    {
        $this->requireServer();
        $key = $this->mintKey($this->devCookieJar($this->uniqEmail('rate')));
        $client = new Client(apiKey: $key, endpoint: self::endpoint());
        $client->id(); // first request allowed
        $err = $this->caught(fn () => $client->id());
        $this->assertSame(429, $err->status);
        $this->assertSame('rate_limited', $err->errorCode);
    }

    public function testFromClientCredentials(): void
    {
        $this->requireServer();
        [$id, $secret] = $this->registerClient('php-cc-test');
        $client = Client::fromClientCredentials($id, $secret, endpoint: self::endpoint());
        $this->assertCount(2, $client->ids(2));
    }

    public function testFromClientCredentialsBad(): void
    {
        $this->requireServer();
        $err = $this->caught(fn () => Client::fromClientCredentials('nope', 'wrong', endpoint: self::endpoint()));
        $this->assertGreaterThanOrEqual(400, $err->status);
    }

    // --- client-side validation ------------------------------------------------

    public function testDefaultEndpoint(): void
    {
        $this->assertSame('https://puid.dev/api', Client::DEFAULT_ENDPOINT);
    }

    public function testRequiresExactlyOneCredential(): void
    {
        $this->assertInstanceOf(PuidError::class, $this->caught(fn () => new Client()));
        $this->assertInstanceOf(PuidError::class, $this->caught(fn () => new Client(apiKey: 'k', accessToken: 't')));
    }

    public function testIdsValidation(): void
    {
        $client = new Client(apiKey: 'k', endpoint: self::endpoint());
        foreach ([0, 11] as $bad) {
            $this->assertSame('invalid_count', $this->caught(fn () => $client->ids($bad))->errorCode);
        }
    }

    public function testOrdinalValidation(): void
    {
        $client = new Client(apiKey: 'k', endpoint: self::endpoint());
        $this->assertSame('invalid_puid', $this->caught(fn () => $client->ordinal(''))->errorCode);
    }

    public function testFromClientCredentialsRequiresArgs(): void
    {
        $this->assertInstanceOf(
            PuidError::class,
            $this->caught(fn () => Client::fromClientCredentials('only', '', endpoint: self::endpoint())),
        );
    }

    // --- cases a live endpoint can't produce -----------------------------------

    public function testNonJsonErrorBody(): void
    {
        $port = $this->freePort();
        $router = (string) tempnam(sys_get_temp_dir(), 'puidrt') . '.php';
        file_put_contents(
            $router,
            "<?php http_response_code(502); header('Content-Type: text/html'); echo '<html>nope</html>';",
        );
        $proc = proc_open(
            [PHP_BINARY, '-S', "127.0.0.1:{$port}", $router],
            [1 => ['file', '/dev/null', 'w'], 2 => ['file', '/dev/null', 'w']],
            $pipes,
        );
        $this->assertIsResource($proc);

        try {
            $this->waitForPort($port);
            $client = new Client(apiKey: 'k', endpoint: "http://127.0.0.1:{$port}");
            $err = $this->caught(fn () => $client->id());
            $this->assertSame(502, $err->status);
            $this->assertNull($err->errorCode);
            $this->assertStringContainsString('HTTP 502', $err->getMessage());
        } finally {
            proc_terminate($proc);
            proc_close($proc);
            @unlink($router);
        }
    }

    public function testNetworkError(): void
    {
        $client = new Client(apiKey: 'k', endpoint: 'http://127.0.0.1:1/api');
        $this->assertSame('network_error', $this->caught(fn () => $client->id())->errorCode);
    }

    private function freePort(): int
    {
        $sock = stream_socket_server('tcp://127.0.0.1:0', $errno, $errstr);
        $name = (string) stream_socket_get_name($sock, false);
        fclose($sock);

        return (int) substr($name, (int) strrpos($name, ':') + 1);
    }

    private function waitForPort(int $port): void
    {
        for ($i = 0; $i < 50; $i++) {
            $conn = @fsockopen('127.0.0.1', $port, $errno, $errstr, 0.2);
            if ($conn !== false) {
                fclose($conn);

                return;
            }
            usleep(100_000);
        }
        $this->fail("php -S did not come up on port {$port}");
    }
}

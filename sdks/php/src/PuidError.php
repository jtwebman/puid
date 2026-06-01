<?php

declare(strict_types=1);

namespace Puid;

/**
 * Thrown for any non-2xx API response and for client-side validation.
 *
 * $status is the HTTP status (null for client-side / transport errors); $errorCode
 * is the API's machine-readable code (e.g. "rate_limited", "quota_exceeded").
 * (Named $errorCode rather than $code because \Exception already defines $code.)
 */
final class PuidError extends \RuntimeException
{
    public function __construct(
        string $message,
        public readonly ?int $status = null,
        public readonly ?string $errorCode = null,
    ) {
        parent::__construct($message);
    }
}

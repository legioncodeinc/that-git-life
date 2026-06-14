// templates/safe-log.ts
//
// Reference implementation of a PII-redacting logger. Drop into
// `src/lib/safe-log.ts` and replace every `console.log` / `Sentry.captureException`
// / `LogRocket.identify` in PII paths with the matching `safeLog.*` call.
//
// Rationale: research/2026-04-24 PII-in-logging findings; guides/04-pii-and-financial.md C2.
//
// Behavior:
//   - Deep-clones the payload.
//   - Walks every object/array; replaces the VALUE of any key matching
//     SENSITIVE_KEYS (case-insensitive, partial match) with '[REDACTED]'.
//   - Masks credit-card-like numbers anywhere in string values.
//   - Leaves the original object untouched.

const SENSITIVE_KEYS: readonly string[] = [
  // auth
  'password', 'pwd', 'passwd',
  'token', 'accessToken', 'access_token', 'refreshToken', 'refresh_token',
  'apiKey', 'api_key', 'secret', 'clientSecret', 'client_secret',
  'authorization', 'auth', 'cookie', 'set-cookie',
  'sessionId', 'session_id',
  // financial
  'cardNumber', 'card_number', 'pan',
  'cvv', 'cvc', 'cvn', 'cvv2',
  'exp', 'exp_month', 'exp_year', 'expiry', 'expiration',
  'iban', 'bic', 'swift', 'routingNumber', 'routing_number',
  'accountNumber', 'account_number',
  // identity
  'ssn', 'socialSecurityNumber', 'social_security_number',
  'taxId', 'tax_id', 'ein', 'nin',
  'driverLicense', 'driver_license', 'passport', 'passportNumber',
  'pin',
  // demographic
  'dob', 'dateOfBirth', 'date_of_birth', 'birthdate',
];

const CC_RE = /\b(?:\d[ -]*?){13,19}\b/g;
const REDACTED = '[REDACTED]';

function isSensitiveKey(key: string): boolean {
  const k = key.toLowerCase();
  return SENSITIVE_KEYS.some((s) => k.includes(s.toLowerCase()));
}

function maskCC(value: string): string {
  return value.replace(CC_RE, (m) => {
    const digits = m.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return m; // not a card
    return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
  });
}

function redactValue(value: unknown, depth = 0): unknown {
  if (depth > 8) return '[DEPTH_LIMIT]';
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') return maskCC(value);

  if (Array.isArray(value)) return value.map((v) => redactValue(v, depth + 1));

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return Object.fromEntries(
      entries.map(([k, v]) => [
        k,
        isSensitiveKey(k) ? REDACTED : redactValue(v, depth + 1),
      ]),
    );
  }

  return value;
}

export function redact<T>(payload: T): T {
  return redactValue(payload) as T;
}

type Level = 'debug' | 'info' | 'warn' | 'error';

function emit(level: Level, message: string, payload?: unknown) {
  const safe = payload === undefined ? undefined : redact(payload);
  const line = safe === undefined
    ? `[${level}] ${message}`
    : `[${level}] ${message} ${JSON.stringify(safe)}`;
  // Route to the real logger in production. This reference implementation
  // uses the console methods but the real version should hand off to
  // pino / winston / your platform logger.
  // eslint-disable-next-line no-console
  (console[level === 'debug' ? 'log' : level] as (s: string) => void)(line);
}

export const safeLog = {
  debug: (message: string, payload?: unknown) => emit('debug', message, payload),
  info:  (message: string, payload?: unknown) => emit('info', message, payload),
  warn:  (message: string, payload?: unknown) => emit('warn', message, payload),
  error: (message: string, payload?: unknown) => emit('error', message, payload),

  /** For plug-in replacement of Sentry.captureException calls */
  captureException: (err: unknown, context?: Record<string, unknown>) => {
    emit('error', 'exception', {
      name: (err as Error)?.name,
      message: (err as Error)?.message,
      // NOTE: stack intentionally NOT sent to telemetry by default —
      // a Sentry integration can re-enable it after confirming Sentry
      // does not ingest into a non-compliant region.
      ...(context ?? {}),
    });
  },
};

export type SafeLog = typeof safeLog;

// Add sensitive keys for your domain
export function extendSensitiveKeys(keys: string[]) {
  for (const k of keys) if (!SENSITIVE_KEYS.includes(k)) (SENSITIVE_KEYS as string[]).push(k);
}

type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const sensitiveKeyPattern =
  /authorization|cookie|password|secret|token|database_url|smtp_password/i;

export async function logEvent(
  level: LogLevel,
  event: string,
  context: LogContext = {},
) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    environment:
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    ...sanitizeContext(context),
  };

  writeToConsole(level, payload);
}

export async function logError(
  event: string,
  error: unknown,
  context: LogContext = {},
) {
  await logEvent(
    "error",
    event,
    {
      ...context,
      error: normalizeError(error),
    },
  );
}

function sanitizeContext(context: LogContext): LogContext {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      sensitiveKeyPattern.test(key) ? "[REDACTED]" : sanitizeValue(value),
    ]),
  );
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return sanitizeContext(value as LogContext);
  }

  return value;
}

function normalizeError(error: unknown) {
  if (!(error instanceof Error)) {
    return {
      name: "UnknownError",
      message: "Unknown server error",
    };
  }

  return {
    name: error.name,
    message: error.message,
    ...(process.env.NODE_ENV !== "production" && error.stack
      ? { stack: error.stack }
      : {}),
  };
}

function writeToConsole(level: LogLevel, payload: LogContext) {
  const serializedPayload = JSON.stringify(payload);

  if (level === "error") {
    console.error(serializedPayload);
    return;
  }

  if (level === "warn") {
    console.warn(serializedPayload);
    return;
  }

  console.info(serializedPayload);
}

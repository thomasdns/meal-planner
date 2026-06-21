import { timingSafeEqual } from "node:crypto";

import { deleteExpiredAuthTokens } from "@/lib/auth-tokens";
import { logError, logEvent } from "@/lib/logger";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret) {
    return Response.json({ error: "Cron is not configured." }, { status: 503 });
  }

  if (!isAuthorized(authorization, cronSecret)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await deleteExpiredAuthTokens();
    await logEvent("info", "expired_auth_tokens_deleted", { count: result.count });
    return Response.json({ deleted: result.count });
  } catch (error) {
    await logError("expired_auth_tokens_cleanup_failed", error);
    return Response.json({ error: "Cleanup failed." }, { status: 500 });
  }
}

function isAuthorized(authorization: string | null, secret: string) {
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(authorization ?? "");

  return expected.length === received.length && timingSafeEqual(expected, received);
}

import type { Instrumentation } from "next";

import { logError } from "@/lib/logger";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  await logError("server_request_failed", error, {
    method: request.method,
    path: request.path.split("?")[0],
    routePath: context.routePath,
    routeType: context.routeType,
    routerKind: context.routerKind,
    digest: getErrorDigest(error),
  });
};

function getErrorDigest(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "digest" in error &&
    typeof error.digest === "string"
  ) {
    return error.digest;
  }

  return undefined;
}

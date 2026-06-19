import type { ReactNode } from "react";

type ActionMessageProps = {
  children: ReactNode;
  tone: "error" | "success";
  className?: string;
};

export function ActionMessage({
  children,
  tone,
  className = "",
}: ActionMessageProps) {
  const toneClassName =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-md border px-3 py-2 text-sm ${toneClassName} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

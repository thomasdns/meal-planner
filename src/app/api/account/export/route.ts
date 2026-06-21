import { getCurrentUserDataExport } from "@/features/profile/profile.data";
import { createAccountExportWorkbook } from "@/lib/account-export-excel";

export const runtime = "nodejs";

export async function GET() {
  const data = await getCurrentUserDataExport();
  const generatedAt = new Date();
  const filename = `meal-planner-export-${generatedAt.toISOString().slice(0, 10)}.xlsx`;
  const workbook = await createAccountExportWorkbook(data);

  return new Response(workbook, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

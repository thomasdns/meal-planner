import { getCurrentUserWeeklyShoppingList } from "@/features/shopping-list/shopping-list.data";
import { createShoppingListExportWorkbook } from "@/lib/shopping-list-export-excel";

export const runtime = "nodejs";

export async function GET() {
  const shoppingList = await getCurrentUserWeeklyShoppingList();
  const filename = `liste-courses-${shoppingList.startDate}.xlsx`;
  const workbook = await createShoppingListExportWorkbook(shoppingList);

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

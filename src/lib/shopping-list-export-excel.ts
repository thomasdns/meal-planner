import "server-only";

import ExcelJS from "exceljs";

import type { WeeklyShoppingList } from "@/features/shopping-list/shopping-list.data";

export async function createShoppingListExportWorkbook(
  shoppingList: WeeklyShoppingList,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Meal Planner";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Liste de courses");
  sheet.columns = [
    { header: "Ingredient", key: "ingredient", width: 28 },
    { header: "Quantite", key: "quantity", width: 14 },
    { header: "Unite", key: "unit", width: 16 },
    { header: "Achete", key: "checked", width: 12 },
    { header: "Recettes", key: "recipes", width: 42 },
  ];

  shoppingList.items.forEach((item) => {
    sheet.addRow({
      ingredient: item.name,
      quantity: item.quantity,
      unit: item.unit,
      checked: item.checked ? "Oui" : "Non",
      recipes: item.recipeTitles.join(", "),
    });
  });

  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF047857" },
  };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = "A1:E1";

  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "top", wrapText: true };
      cell.border = {
        bottom: {
          style: "thin",
          color: { argb: rowNumber === 1 ? "FF047857" : "FFE2E8F0" },
        },
      };
    });
  });

  return workbook.xlsx.writeBuffer();
}

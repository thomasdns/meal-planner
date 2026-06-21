import "server-only";

import ExcelJS from "exceljs";

type DataExport = Awaited<
  ReturnType<typeof import("@/features/profile/profile.data").getCurrentUserDataExport>
>;

type RowValue = string | number | boolean | null | Date;

type SheetRow = Record<string, RowValue>;

export async function createAccountExportWorkbook(data: DataExport) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Meal Planner";
  workbook.created = new Date();

  addSheet(workbook, "Profil", [
    {
      Champ: "Nom affiche",
      Valeur: data.name,
    },
    {
      Champ: "Email",
      Valeur: data.email,
    },
    {
      Champ: "Email verifie",
      Valeur: data.emailVerified ? "Oui" : "Non",
    },
    {
      Champ: "Role",
      Valeur: data.role,
    },
    {
      Champ: "Compte cree le",
      Valeur: data.createdAt,
    },
  ]);

  addSheet(
    workbook,
    "Categories",
    data.categories.map((category) => ({
      Nom: category.name,
      Couleur: category.color,
      Creee_le: category.createdAt,
      Modifiee_le: category.updatedAt,
    })),
  );

  addSheet(
    workbook,
    "Recettes",
    data.recipes.map((recipe) => ({
      Titre: recipe.title,
      Description: recipe.description,
      Portions: recipe.servings,
      Preparation_minutes: recipe.prepTime,
      Cuisson_minutes: recipe.cookTime,
      Etapes: recipe.steps,
      Image: recipe.imageUrl,
      Creee_le: recipe.createdAt,
      Modifiee_le: recipe.updatedAt,
    })),
  );

  addSheet(
    workbook,
    "Ingredients",
    data.recipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ({
        Recette: recipe.title,
        Ingredient: ingredient.name,
        Quantite: ingredient.quantity,
        Unite: ingredient.unit,
        Cree_le: ingredient.createdAt,
        Modifie_le: ingredient.updatedAt,
      })),
    ),
  );

  addSheet(
    workbook,
    "Planning",
    data.mealPlans.map((mealPlan) => {
      const recipe = data.recipes.find((item) => item.id === mealPlan.recipeId);

      return {
        Date: mealPlan.date,
        Repas: mealPlan.mealType,
        Recette: recipe?.title ?? mealPlan.recipeId,
        Cree_le: mealPlan.createdAt,
        Modifie_le: mealPlan.updatedAt,
      };
    }),
  );

  return workbook.xlsx.writeBuffer();
}

function addSheet(workbook: ExcelJS.Workbook, name: string, rows: SheetRow[]) {
  const sheet = workbook.addWorksheet(name);

  if (rows.length === 0) {
    sheet.addRow(["Aucune donnee"]);
    sheet.getCell("A1").font = { bold: true };
    sheet.columns = [{ width: 24 }];
    return;
  }

  const headers = Object.keys(rows[0]);
  sheet.columns = headers.map((header) => ({
    header: header.replaceAll("_", " "),
    key: header,
    width: Math.max(16, Math.min(42, header.length + 8)),
  }));

  rows.forEach((row) => {
    sheet.addRow(row);
  });

  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF047857" },
  };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length },
  };

  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "top", wrapText: true };
      cell.border = {
        bottom: {
          style: "thin",
          color: { argb: rowNumber === 1 ? "FF047857" : "FFE2E8F0" },
        },
      };

      if (cell.value instanceof Date) {
        cell.numFmt = "dd/mm/yyyy hh:mm";
      }
    });
  });
}

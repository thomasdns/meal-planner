import { ShoppingList } from "@/features/shopping-list/shopping-list";
import { getCurrentUserWeeklyShoppingList } from "@/features/shopping-list/shopping-list.data";

export default async function ShoppingListPage() {
  const shoppingList = await getCurrentUserWeeklyShoppingList();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">Preparation</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Liste de courses
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Ingredients consolides a partir des recettes planifiees du{" "}
          {shoppingList.startDate} au {shoppingList.endDate}.
        </p>
      </div>

      <ShoppingList shoppingList={shoppingList} />
    </div>
  );
}

import { fetchMeals, Meal, MealDraft, createMeal } from "./meals.js";
import { User } from "./user.js";
import { renderWallet, renderOrderHistory, renderMealList } from "./dom.js";

const user = new User(1, "Bob", 150);
const localMeals: Meal[] = [];

function refresh(): void {
  renderWallet(user);
  renderOrderHistory(user);
}

async function init(): Promise<void> {
  refresh();

  const meals = await fetchMeals();
  renderMealList(meals, user, refresh);
}

document.getElementById("addMealBtn")?.addEventListener("click", () => {
  const name = (
    document.getElementById("mealName") as HTMLInputElement
  ).value.trim();
  const calories = parseInt(
    (document.getElementById("mealCalories") as HTMLInputElement).value,
  );
  const price = parseFloat(
    (document.getElementById("mealPrice") as HTMLInputElement).value,
  );

  if (!name || isNaN(calories) || isNaN(price)) return;

  const draft: MealDraft = { name, calories, price };
  const meal = createMeal(draft, localMeals.length + 1);

  localMeals.push(meal);
  renderMealList(localMeals, user, refresh);
});

init();

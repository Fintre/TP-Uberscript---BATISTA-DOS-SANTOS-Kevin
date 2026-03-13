import { fetchMeals, Meal, MealDraft, createMeal } from "./meals.js";
import { User } from "./user.js";
import { TropPauvreErreur } from "./errors.js";

const user = new User(1, "Bob", 30);
const localMeals: Meal[] = [];

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
  appendMealToList(meal);
});

function appendMealToList(meal: Meal): void {
  const mealList = document.getElementById("mealList") as HTMLUListElement;
  const li = document.createElement("li");
  li.textContent = `${meal.name} - ${meal.price}€ `;

  const button = document.createElement("button");
  button.textContent = "Commander";
  button.addEventListener("click", () => {
    try {
      user.orderMeal(meal);
      renderWallet();
      renderOrderHistory();
    } catch (error) {
      if (error instanceof TropPauvreErreur) {
        alert(
          `${error.message}\n Solde : ${error.solde}€\n Prix : ${error.prixCommande}€`,
        );
      } else {
        throw error;
      }
    }
  });

  li.appendChild(button);
  mealList.appendChild(li);
}

function renderWallet(): void {
  const walletEl = document.getElementById("walletAmount");
  if (walletEl) walletEl.textContent = `${user.wallet}€`;
}

function renderOrderHistory(): void {
  const historyList = document.getElementById(
    "orderHistory",
  ) as HTMLUListElement;
  if (!historyList) return;

  historyList.innerHTML = "";

  if (user.orders.length === 0) {
    historyList.innerHTML = `<li class="list-group-item text-muted">Aucune commande</li>`;
    return;
  }

  user.orders.forEach((order) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <strong>Commande #${order.id}</strong> — ${order.total}€<br>
      <small>${order.meals.map((m) => m.name).join(", ")}</small>
    `;
    historyList.appendChild(li);
  });
}

async function displayMeals(): Promise<void> {
  const mealList = document.getElementById("mealList") as HTMLUListElement;
  const meals: Meal[] = await fetchMeals();

  meals.forEach((meal) => {
    const li = document.createElement("li");
    li.textContent = `${meal.name} - ${meal.price}€ `;

    const button = document.createElement("button");
    button.textContent = "Commander";

    button.addEventListener("click", () => {
      try {
        user.orderMeal(meal);
        renderWallet();
        renderOrderHistory();
        alert(`${meal.name} commandé. Solde restant : ${user.wallet}€`);
      } catch (error) {
        if (error instanceof TropPauvreErreur) {
          alert(
            `${error.message}\n\n` +
              `Votre solde : ${error.solde}€\n` +
              `Prix du repas : ${error.prixCommande}€`,
          );
        } else {
          throw error;
        }
      }
    });

    li.appendChild(button);
    mealList.appendChild(li);
  });
}

// Initialisation
renderWallet();
renderOrderHistory();
displayMeals();

import { Meal } from "./meals.js";
import { User } from "./user.js";
import { TropPauvreErreur } from "./errors.js";

export function renderWallet(user: User): void {
  const walletEl = document.getElementById("walletAmount");

  if (walletEl) {
    walletEl.textContent = user.wallet.toFixed(2) + "€";
  }
}

export function renderOrderHistory(user: User): void {
  const historyList = document.getElementById(
    "orderHistory",
  ) as HTMLUListElement;

  if (!historyList) return;

  historyList.innerHTML = "";

  if (user.orders.length === 0) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = "Aucune commande.";
    historyList.appendChild(li);
    return;
  }

  user.orders.forEach((order) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent =
      "Commande #" +
      order.id +
      " - " +
      order.total.toFixed(2) +
      "€ - " +
      order.meals.map((m) => m.name).join(", ");
    historyList.appendChild(li);
  });
}

export function renderMealList(
  meals: Meal[],
  user: User,
  onOrderSuccess: () => void,
): void {
  const mealList = document.getElementById("mealList") as HTMLUListElement;

  if (!mealList) return;

  mealList.innerHTML = "";

  meals.forEach((meal) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    const span = document.createElement("span");
    span.textContent = meal.name + " - " + meal.price.toFixed(2) + "€";

    const button = document.createElement("button");
    button.className = "btn btn-sm btn-primary";
    button.textContent = "Commander";

    button.addEventListener("click", () => {
      try {
        user.orderMeal(meal);
        onOrderSuccess();
      } catch (error) {
        if (error instanceof TropPauvreErreur) {
          alert(
            "Fonds insuffisants\nSolde : " +
              error.solde +
              "€\nPrix : " +
              error.prixCommande +
              "€",
          );
        }
      }
    });

    li.appendChild(span);
    li.appendChild(button);
    mealList.appendChild(li);
  });
}

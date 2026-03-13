var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchMeals } from "./meals.js";
import { User } from "./user.js";
import { TropPauvreErreur } from "./errors.js";
const user = new User(1, "Bob", 30);
function renderWallet() {
    const walletEl = document.getElementById("walletAmount");
    if (walletEl)
        walletEl.textContent = `${user.wallet}€`;
}
function renderOrderHistory() {
    const historyList = document.getElementById("orderHistory");
    if (!historyList)
        return;
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
function displayMeals() {
    return __awaiter(this, void 0, void 0, function* () {
        const mealList = document.getElementById("mealList");
        const meals = yield fetchMeals();
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
                    alert(`✅ ${meal.name} commandé ! Solde restant : ${user.wallet}€`);
                }
                catch (error) {
                    if (error instanceof TropPauvreErreur) {
                        alert(`❌ ${error.message}\n\n` +
                            `💰 Votre solde : ${error.solde}€\n` +
                            `🍽️ Prix du repas : ${error.prixCommande}€`);
                    }
                    else {
                        throw error;
                    }
                }
            });
            li.appendChild(button);
            mealList.appendChild(li);
        });
    });
}
// Initialisation
renderWallet();
renderOrderHistory();
displayMeals();

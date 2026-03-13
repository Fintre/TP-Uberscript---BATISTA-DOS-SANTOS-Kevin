var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { fetchMeals, createMeal } from "./meals.js";
import { User } from "./user.js";
import { renderWallet, renderOrderHistory, renderMealList } from "./dom.js";
const user = new User(1, "Bob", 150);
const localMeals = [];
function refresh() {
    renderWallet(user);
    renderOrderHistory(user);
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        refresh();
        const meals = yield fetchMeals();
        renderMealList(meals, user, refresh);
    });
}
(_a = document.getElementById("addMealBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const name = document.getElementById("mealName").value.trim();
    const calories = parseInt(document.getElementById("mealCalories").value);
    const price = parseFloat(document.getElementById("mealPrice").value);
    if (!name || isNaN(calories) || isNaN(price))
        return;
    const draft = { name, calories, price };
    const meal = createMeal(draft, localMeals.length + 1);
    localMeals.push(meal);
    renderMealList(localMeals, user, refresh);
});
init();

import { fetchMeals, Meal } from "./meals.js";
async function displayMeals() {
  const mealList = document.getElementById("mealList") as HTMLUListElement;
  const meals: Meal[] = await fetchMeals();

  meals.forEach((meal) => {
    const li = document.createElement("li");

    li.textContent = `${meal.name} - ${meal.price}€ `;

    const button = document.createElement("button");
    button.textContent = "Commander";

    button.addEventListener("click", () => {
      console.log("Repas commandé :", meal);
    });

    li.appendChild(button);
    mealList.appendChild(li);
  });
}
displayMeals();

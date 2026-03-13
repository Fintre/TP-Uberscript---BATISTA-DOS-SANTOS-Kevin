import { ApiError } from "./errors.js";

export type Meal = {
  id: number;
  name: string;
  calories: number;
  price: number;
};

// Omit : un repas en cours de création n'a pas encore d'id
export type MealDraft = Omit<Meal, "id">;

export type Order = {
  id: number;
  meals: Meal[];
  total: number;
};

export async function fetchMeals(): Promise<Meal[]> {
  try {
    const response = await fetch(
      "https://keligmartin.github.io/api/meals.json",
    );

    if (!response.ok) {
      throw new ApiError("Erreur lors du chargement des repas");
    }

    const data: Meal[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors du chargement des repas");
    throw error;
  }
}

export function createMeal(draft: MealDraft, id: number): Meal {
  return { id, ...draft };
}

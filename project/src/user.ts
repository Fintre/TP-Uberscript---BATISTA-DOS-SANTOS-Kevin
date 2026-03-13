import { Meal, Order } from "./meals.js";
import { TropPauvreErreur } from "./errors.js";

const STORAGE_KEY_ORDERS = "user_orders";
const STORAGE_KEY_WALLET = "user_wallet";

export type UserProfile = {
  id: number;
  name: string;
  wallet: number;
};

export type UserProfileUpdate = Partial<UserProfile>;

export class User {
  id: number;
  name: string;
  wallet: number;
  orders: Order[];

  constructor(id: number, name: string, wallet: number) {
    this.id = id;
    this.name = name;
    this.wallet = this.loadWallet(wallet);
    this.orders = this.loadOrders();
  }

  updateProfile(updates: UserProfileUpdate): void {
    if (updates.name !== undefined) this.name = updates.name;
    if (updates.wallet !== undefined) this.wallet = updates.wallet;
    // id non modifiable volontairement même si présent dans Partial
  }

  private loadOrders(): Order[] {
    const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
    return stored ? JSON.parse(stored) : [];
  }

  private loadWallet(defaultWallet: number): number {
    const stored = localStorage.getItem(STORAGE_KEY_WALLET);
    return stored !== null ? parseFloat(stored) : defaultWallet;
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
    localStorage.setItem(STORAGE_KEY_WALLET, this.wallet.toString());
  }

  orderMeal(meal: Meal): void {
    if (this.wallet < meal.price) {
      throw new TropPauvreErreur(
        `Fonds insuffisants : solde ${this.wallet}€, prix du repas ${meal.price}€ (manque ${(meal.price - this.wallet).toFixed(2)}€)`,
        this.wallet,
        meal.price,
      );
    }

    this.wallet -= meal.price;

    const order: Order = {
      id: this.orders.length + 1,
      meals: [meal],
      total: meal.price,
    };

    this.orders.push(order);
    this.saveToStorage();
  }
}

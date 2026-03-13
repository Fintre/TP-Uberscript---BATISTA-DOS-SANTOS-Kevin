import { TropPauvreErreur } from "./errors.js";
const STORAGE_KEY_ORDERS = "user_orders";
const STORAGE_KEY_WALLET = "user_wallet";
export class User {
    constructor(id, name, wallet) {
        this.id = id;
        this.name = name;
        this.wallet = this.loadWallet(wallet);
        this.orders = this.loadOrders();
    }
    loadOrders() {
        const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
        return stored ? JSON.parse(stored) : [];
    }
    loadWallet(defaultWallet) {
        const stored = localStorage.getItem(STORAGE_KEY_WALLET);
        return stored !== null ? parseFloat(stored) : defaultWallet;
    }
    saveToStorage() {
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
        localStorage.setItem(STORAGE_KEY_WALLET, this.wallet.toString());
    }
    orderMeal(meal) {
        if (this.wallet < meal.price) {
            throw new TropPauvreErreur(`Fonds insuffisants : solde ${this.wallet}€, prix du repas ${meal.price}€ (manque ${(meal.price - this.wallet).toFixed(2)}€)`, this.wallet, meal.price);
        }
        this.wallet -= meal.price;
        const order = {
            id: this.orders.length + 1,
            meals: [meal],
            total: meal.price,
        };
        this.orders.push(order);
        this.saveToStorage();
        console.log(`✅ Commande #${order.id} — ${meal.name} (${meal.price}€) — Solde restant : ${this.wallet}€`);
    }
}

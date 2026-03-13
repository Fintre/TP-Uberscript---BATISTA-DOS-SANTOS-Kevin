export class ApiError extends Error {
    constructor(message) {
        super(message);
        this.name = "ApiError";
    }
}
export class TropPauvreErreur extends Error {
    constructor(message, solde, prixCommande) {
        super(message);
        this.name = "TropPauvreErreur";
        this.solde = solde;
        this.prixCommande = prixCommande;
    }
}

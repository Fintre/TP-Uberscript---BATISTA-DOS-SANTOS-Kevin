export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class TropPauvreErreur extends Error {
  solde: number;
  prixCommande: number;

  constructor(message: string, solde: number, prixCommande: number) {
    super(message);
    this.name = "TropPauvreErreur";
    this.solde = solde;
    this.prixCommande = prixCommande;
  }
}

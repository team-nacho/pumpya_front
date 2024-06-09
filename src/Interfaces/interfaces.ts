export interface Party {
  partyId: string;
  partyName: string;
  members: string[];
  receipts: Receipt[];
  totalCost: number;
}
export interface Receipt {
  receiptId: string;
  partyId: string;
  receiptName: string;
  author: string | undefined;
  joins: string[];
  cost: number;
  useCurrency: string | undefined;
  createdAt: Date | undefined;
  useTag: string | undefined;
}
export interface Tag {
  name: string;
}

export interface Currency {
  currencyId: string;
  country: string;
}

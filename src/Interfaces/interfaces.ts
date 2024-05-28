export interface Member {
  name: string;
  usedCost: number;
}
export interface Party {
  partyId: string;
  partyName: string;
  members: String[];
  receipts: Receipt[];
  totalCost: number;
}
export interface Receipt {
  partyId: string;
  receiptName: string;
  author: string | undefined;
  joins: string[];
  cost: number;
  useCurrency: string | undefined;
  createdAt: Date | undefined;
  tag: string | undefined;
}
export interface Tag {
  name: string;
}

export interface Currency {
  currencyId: string;
  country: string;
}

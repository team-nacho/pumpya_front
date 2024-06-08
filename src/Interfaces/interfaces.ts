export interface Party {
  partyId: string;
  partyName: string;
  members: string[];
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
  useTag: string | undefined;
}
export interface Tag {
  name: string;
}

export interface Currency {
  currencyId: string;
  country: string;
}

export interface from {
  from: string;
  to: To[];
}

export interface To{
  to: string;
  amount: number;
}

export interface Settlement {
  currency: string;
  transactions: from[];
}
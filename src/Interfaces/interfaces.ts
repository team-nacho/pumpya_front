export interface Member {
  name: string;
  usedCost: number;
}
export interface Party {
  id: string;
  name: string;
  member: Member[];
  receipts: Receipt[];
  totalCost: number;
}
export interface Receipt {
  name: string;
  author: Member | undefined;
  join: Member[];
  cost: number;
  useCurrency: Currency | undefined;
  createDate: Date | undefined;
  tag: Tag | undefined;
}
export interface Tag {
  name: string;
}

export interface Currency {
  currencyId: string;
  country: string;
}
import { Party, Receipt, Currency } from "./interfaces";

export interface CreateMemberResponse {
  member: string;
}
export interface CreatePartyResponse extends Party {}
export interface GetPartyResponse {
  partyId: string;
  partyName: string;
  members: string[];
  usedCurrencies: string[];
}
export interface CreateReceiptResponse extends Receipt {}
export interface GetTagResponse {
  tags: string[];
}

export interface GetCurrencyResponse {
  currencies: Currency[];
}
export interface ReceiptResponse {
  receiptId: string;
  partyId: string;
  receiptName: string;
  author: string | undefined;
  joins: string;
  cost: number;
  useCurrency: string | undefined;
  createdAt: number;
  useTag: string | undefined;
}
export type GetReceiptsResponse = ReceiptResponse[];

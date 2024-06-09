import { Party, Receipt, Currency, Settlement } from "./interfaces";

export interface CreatePartyResponse extends Party {}
export interface GetPartyResponse {
  partyId: string;
  partyName: string;
  usedCurrencies: String[];
  members: string[];
}
export interface createReceiptResponse extends Receipt {}

export interface GetTagResponse{
  tags: string[];
}

export interface GetCurrencyResponse{
  currencies:Currency[]
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

export interface GetResultResponse{
  result: any;
}
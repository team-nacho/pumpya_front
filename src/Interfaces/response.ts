
import { Party, Receipt, Currency, ExchangeRate } from "./interfaces";

export interface CreateMemberResponse {
  member: string;
}
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

export interface GetResultResponse{
  result: ExchangeRate[];
}
export interface GetPartyHistoryResponse{
  partyName: string;
  partyArch: ExchangeRate[];
}
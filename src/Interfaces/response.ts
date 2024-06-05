import { Party, Receipt, Settlement } from "./interfaces";

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
  currencies:{
    currencyId: string;
    country: string;
  }
}

export interface GetReceiptResponse{
  receipts: Receipt[];
}

export interface GetResultResponse{
  result: any;
}
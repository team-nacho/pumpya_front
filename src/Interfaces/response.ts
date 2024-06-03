import { Party, Receipt } from "./interfaces";

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
export interface createReceiptResponse extends Receipt {}

import { Member, Party, Receipt } from "./interfaces";

export interface CreateMemberResponse {
  member: Member;
}
export interface CreatePartyResponse extends Party {}
export interface GetPartyResponse {
  partyId: string;
  partyName: string;
  members: Member[];
  usedCurrencies: String;
}
export interface createReceiptResponse extends Receipt {}
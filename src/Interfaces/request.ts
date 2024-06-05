import { Receipt } from "./interfaces";

export interface CreatePartyRequest {
  userName: string;
}
export interface CreateReceiptRequest {
  sender: String;
  receipt: Receipt;
}
export interface CreateMemberReqeust {
  member: string;
}
export interface GetParty {
  partyId: string;
}

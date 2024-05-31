import { Receipt } from "./interfaces";

export interface CreatePartyRequest {
  userName: string;
}
export interface CreateReceiptRequest {
  sender: string;
  receipt: Receipt;
}
export interface CreateMemberReqeust {
  member: string;
}

export interface GetParty {
  partyId: string;
}

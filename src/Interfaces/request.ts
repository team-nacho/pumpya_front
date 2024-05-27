import { Member, Receipt } from "./interfaces";

export interface CreatePartyRequest {
  userName: string;
}
export interface CreateReceiptRequest {
  sender: String;
  receipt: Receipt;
}
export interface CreateMemberReqeust {
  member: Member;
}

export interface GetParty {
  partyId: string;
}

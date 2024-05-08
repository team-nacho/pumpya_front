import { Member, Receipt } from "./interfaces";

export interface CreatePartyRequest {
  userName: string;
}
export interface CreateRecieptRequest {
  sender: String,
  reciept: Receipt
}
export interface CreateMemberReqeust {
  member: Member,
}
import { Member, Reciept } from "./interfaces";

export interface CreatePartyRequest {
  userName: string;
}
export interface CreateRecieptRequest {
  sender: String,
  reciept: Reciept
}
export interface CreateMemberReqeust {
  member: Member,
}
import { Member, Party, Reciept } from "./interfaces";

export interface CreatePartyRequest {
  party: Party
}
export interface CreateRecieptRequest {
  reciept: Reciept
}
export interface CreateMemberReqeust {
  member: Member,
}
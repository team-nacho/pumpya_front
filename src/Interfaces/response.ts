import { Member, Party } from "./interfaces";

export interface CreateMemberResponse {
  member: Member;
}
export interface CreatePartyResponse extends Party {}
export interface GetPartyResponse extends Party {}
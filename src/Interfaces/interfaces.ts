export interface Member {
  name: string,
  usedCost: number
}
export interface Party {
  id: string,
  name: string,
  member: Member[],
  reciepts: Reciept[],
  totalCost: number,
}
export interface Reciept {
  name: string,
  author: Member | undefined,
  join: Member[],
  cost: number,
  currency: string,
  createDate: Date | undefined,
}
export interface Tag {
  name: string,
}



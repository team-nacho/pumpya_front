import {
  Member,
  Party,
  Receipt,
  Tag,
  Currency,
} from "../../Interfaces/interfaces";

export const currencyList: Currency[] = [
  { currencyId: "USD", country: "미국" },
  { currencyId: "KRW", country: "대한민국" },
];
export const dummyMembers: Member[] = [
  { name: "건영", usedCost: 2000 },
  { name: "성현", usedCost: 300000 },
  { name: "재윤", usedCost: 250000 },
  { name: "인서", usedCost: 10000 },
];

export const dummyTags: Tag[] = [
  { name: "음식" },
  { name: "엔터" },
  { name: "교통" },
];

export const dummyParties: Party[] = [
  {
    partyId: "1",
    partyName: "안타까운 고라니",
    member: dummyMembers,
    receipts: [],
    totalCost: 500000,
  },
];

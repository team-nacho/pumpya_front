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
    id: "1",
    name: "안타까운 고라니",
    member: dummyMembers,
    receipts: [],
    totalCost: 500000,
  },
];

export const dummyReceipts: Receipt[] = [
  {
    id: "0001",
    name: "생일파티",
    author: dummyMembers[0],
    join: [dummyMembers[0], dummyMembers[1]],
    cost: 500000,
    useCurrency: currencyList[0],
    createDate: new Date(),
    tag: dummyTags[1],
  },
  {
    id: "0002",
    name: "롯데월드",
    author: dummyMembers[2],
    join: [dummyMembers[1], dummyMembers[2]],
    cost: 62000,
    useCurrency: currencyList[0],
    createDate: new Date(),
    tag: dummyTags[1],
  },
];
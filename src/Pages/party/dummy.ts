import {
  Member,
  Party,
  Receipt,
  Tag,
  Currency,
} from "../../Interfaces/interfaces";

const dummyMembers: Member[] = [
  { name: "Alice", usedCost: 100 },
  { name: "Bob", usedCost: 200 },
  { name: "Charlie", usedCost: 300 },
];

const dummyReceipts: Receipt[] = [
  {
    partyId: "party1",
    receiptName: "Dinner",
    author: "Alice",
    joins: ["Alice", "Bob"],
    cost: 150,
    useCurrency: "USD",
    createdAt: new Date("2023-01-01"),
    tag: "food",
  },
  {
    partyId: "party1",
    receiptName: "Hotel",
    author: "Bob",
    joins: ["Alice", "Charlie"],
    cost: 300,
    useCurrency: "USD",
    createdAt: new Date("2023-01-02"),
    tag: "accommodation",
  },
];

const dummyParty: Party = {
  partyId: "party1",
  partyName: "New Year Party",
  members: ["Alice", "Bob", "Charlie"],
  receipts: dummyReceipts,
  totalCost: 450,
};

const dummyTags: Tag[] = [
  { name: "food" },
  { name: "accommodation" },
  { name: "transport" },
];

const dummyCurrencies: Currency[] = [
  { currencyId: "USD", country: "United States" },
  { currencyId: "EUR", country: "Eurozone" },
  { currencyId: "JPY", country: "Japan" },
];

export { dummyMembers, dummyParty, dummyReceipts, dummyTags, dummyCurrencies };

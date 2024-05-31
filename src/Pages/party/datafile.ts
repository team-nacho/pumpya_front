import { Tag, Currency } from "../../Interfaces/interfaces";

const tagList: Tag[] = [{ name: "음식" }, { name: "숙박" }, { name: "교통" }];

const currencyList: Currency[] = [
  { currencyId: "USD", country: "미국" },
  { currencyId: "EUR", country: "유럽" },
  { currencyId: "JPY", country: "일본" },
];

export { tagList, currencyList };

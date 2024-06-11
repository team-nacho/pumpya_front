import moment from "moment";
import { Receipt } from "../Interfaces/interfaces";

export const sortReceiptInDate = (list: Receipt[]) => {
  let dateList: Map<string, Receipt[]> = new Map();
    
  const reversed_list = list.sort((a: Receipt, b: Receipt) => {
    return moment(b.createdAt).diff(a.createdAt);
  })

  for(const i of reversed_list) {
    const d = moment(i.createdAt).format('YYYY-MM-DD');

    if(!dateList.has(d)) dateList.set(d, []);
    dateList.get(d)?.push(i);
  }

  return dateList;
}
import axios, { AxiosResponse } from "axios";
import { CreatePartyRequest } from "../Interfaces/request";
import { CreatePartyResponse, GetPartyResponse } from "../Interfaces/response";
import { get } from "http";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASEURL
})

export const partyApi = {
  createParty: async (
    request: CreatePartyRequest
  ): Promise<AxiosResponse<CreatePartyResponse>> => {
    const resposne = await api.post("/create-party", request);
    return resposne;
  },
  getParty: async (
    partyId: string
  ): Promise<AxiosResponse<GetPartyResponse>> => {
    const response = await api.get(`/get-party/${partyId}`);
    return response;
  }
}
export const receiptApi = {
  getReceipts: async (
    partyId: string
  ): Promise<AxiosResponse<GetPartyResponse>> => {
    const response = await api.get(`/get-receipts/${partyId}`);
    return response;
  }
}
export const tagApi = {
  getTags: async (
  ): Promise<AxiosResponse<GetPartyResponse>> => {
    const response = await api.get(`/get-tags`);
    return response;
  }
}
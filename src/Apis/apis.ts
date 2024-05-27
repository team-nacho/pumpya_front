import axios, { AxiosResponse } from "axios";
import { CreatePartyRequest } from "../Interfaces/request";
import { CreatePartyResponse, GetPartyResponse } from "../Interfaces/response";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASEURL
})

export const partyApi = {
  createParty: async (
    request: CreatePartyRequest
  ): Promise<AxiosResponse<CreatePartyResponse>> => {
    const resposne = await api.post("create-party", request);
    return resposne;
  },

}
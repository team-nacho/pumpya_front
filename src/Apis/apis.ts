import axios, { AxiosResponse } from "axios";
import { CreatePartyRequest } from "../Interfaces/request";
import { CreatePartyResponse } from "../Interfaces/response";

const api = axios.create({
  baseURL: "http://172.30.1.87:8080"
})

export const partyApi = {
  createParty: async (
    request: CreatePartyRequest
  ): Promise<AxiosResponse<CreatePartyResponse>> => {
    const resposne = await api.post("create-party", request);
    return resposne;
  }
}
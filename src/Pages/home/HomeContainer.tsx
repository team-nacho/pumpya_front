import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAsync } from "react-use";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import HomePresentation from "./HomePresentation";
import { CreatePartyRequest, GetParty } from "../../Interfaces/request";
import { AxiosResponse, HttpStatusCode } from "axios";
import { partyApi } from "../../Apis/apis";
import {
  CreatePartyResponse,
  GetPartyResponse,
} from "../../Interfaces/response";
import { Party } from "../../Interfaces/interfaces";

const HomeContainer = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [randomName, setRandomName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [partyCreated, setPartyCreated] = useState<boolean>(false);
  const appContext = useAppContext();
  const [animals1, setAnimals1] = useState<string[]>([]);
  const [animals2, setAnimals2] = useState<string[]>([]);

  const fetchTextFile = async (url: string) => {
    const response = await fetch(url);
    const text = await response.text();
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
  };

  useAsync(async () => {
    const data1 = await fetchTextFile("/f.txt");
    const data2 = await fetchTextFile("/s.txt");
    setAnimals1(data1);
    setAnimals2(data2);
  }, []);

  const combineNames = () => {
    if (animals1.length > 0 && animals2.length > 0) {
      const randomIndex1 = Math.floor(Math.random() * animals1.length);
      const randomIndex2 = Math.floor(Math.random() * animals2.length);
      setRandomName(animals1[randomIndex1] + " " + animals2[randomIndex2]);
    }
  };

  const onClickCreateParty = async () => {
    const request: CreatePartyRequest = {
      userName: nickname !== null ? nickname : randomName,
    };

    const response: AxiosResponse<CreatePartyResponse> =
      await partyApi.createParty(request);

    const requestMembers: GetParty = {
      partyId: response.data.partyId,
    };
    const responseMembers: AxiosResponse<GetPartyResponse> =
      await partyApi.getParty(requestMembers.partyId);

    if (response.status === HttpStatusCode.Ok) {
      //그리고 생성된 유저 내용은 local history에 저장
      const localCurrentMember = {
        pumpya_user_name: request.userName,
        pumpya_party_id: response.data.partyId,
      };
      localStorage.setItem("pumpya_user", JSON.stringify(localCurrentMember));
      //save current memeber
      onClose();

      appContext.setCurrentMember(request.userName);
      //save party data
      appContext.setParty((prev: Party) => ({
        ...prev,
        partyId: response.data.partyId,
        partyName: response.data.partyName,
        members: responseMembers.data.members,
        totalCost: response.data.totalCost,
      }));

      // 상태 업데이트 후 navigate를 호출하기 위한 플래그 설정
      setPartyCreated(true);
    }
  };
  const handleInputNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    //랜덤 이름을 프론트에서 만들던지 아니면 api로 불러오던지
    setNickname(e.target.value);
  };

  useEffect(() => {
    if (partyCreated) {
      navigate(`/party/${appContext.party.partyId}`);
      console.log(appContext);
      setPartyCreated(false); // 플래그를 리셋하여 무한 루프 방지
    }
  }, [partyCreated, navigate, appContext?.party?.partyId]);
  useEffect(() => {
    combineNames();
    setNickname(randomName);
  }, []);

  return (
    <HomePresentation
      nickname={nickname}
      setNickname={setNickname}
      onClickCreateParty={onClickCreateParty}
      handleInputNickName={handleInputNickName}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
};

export default HomeContainer;

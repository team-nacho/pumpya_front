import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

  const onClickCreateParty = async () => {
    //첫 사용자 이름이 정해지면 api호출해서
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
    setRandomName("random name");
    setNickname(randomName);
  }, [randomName]);

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

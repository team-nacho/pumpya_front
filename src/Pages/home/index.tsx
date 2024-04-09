import { 
  Button, 
  Flex, 
  Text,
  Heading, 
  Input, 
  Modal, 
  ModalBody, 
  ModalCloseButton,
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay,
  useDisclosure 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CreatePartyRequest } from "../../Interfaces/request";
import { CreatePartyResponse } from "../../Interfaces/response";
import { useNavigate } from "react-router-dom";
import { partyApi } from "../../Apis/apis";
import { AxiosResponse, HttpStatusCode } from "axios";

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [randomName, setRandomName] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  const onClickCreateParty = async () => {
    //첫 사용자 이름이 정해지면 api호출해서 
    const request: CreatePartyRequest = {
      userName: (nickname !== null ? nickname : randomName)
    }
    const response: AxiosResponse<CreatePartyResponse> = await partyApi.createParty(request);
  
    if(response.status === HttpStatusCode.Ok) {
      console.log(response);
      //그리고 생성된 유저 내용은 local history에 저장
  
      localStorage.setItem("pumpya_user_name", (nickname !== null ? nickname : randomName));
      onClose();
      navigate(`/party/${response.data.id}`);
    }

   
  }
  const handleInputNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  }

  useEffect(() => {
    
    setRandomName("random name");
    setNickname(randomName);
  }, [randomName]);
  return (
    <Flex
      flexDir="column"
    >
      <Heading>PUMPYA!</Heading>
      <Button onClick={onOpen}>Create Party!</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your Nickname</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>you can use your nickname!</Text>
            <Text>but also can use random animal nickname!</Text>
            <Input placeholder={nickname} onChange={handleInputNickName}/>
          </ModalBody>
           
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClickCreateParty}>
              Create!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default HomePage;
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
  Center,
} from "@chakra-ui/react";

interface HomePresentationProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  randomName: string;
  onClickCreateParty: () => void;
  handleInputNickName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const HomePresentation = (props: HomePresentationProps) => (
  <Flex flexDir="column" flex="1">
    <Center>
      <Heading size="2xl" >PUMPYA!</Heading>
    </Center>
    <Center mb="5">
      <Text>파티원들과 함께 여행 경비를 뿜빠야!</Text>
    </Center>
    <Button onClick={props.onOpen}>파티 생성하기</Button>

    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent margin="auto" ml="20px" mr="20px">
        <ModalHeader>이름을 입력해주세요</ModalHeader>
        <ModalBody>
          <Input
            placeholder={props.randomName}
            onChange={props.handleInputNickName}
          />
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="space-between" w="100%">
            <Button colorScheme="red" onClick={props.onClose}>
              취소  
            </Button>
            <Button onClick={props.onClickCreateParty}>
              파티 생성하기
            </Button>
          </Flex>
          
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Flex>
);

export default HomePresentation;

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
  <Flex flexDir="column">
    <Heading>PUMPYA!</Heading>
    <Button onClick={props.onOpen}>Create Party!</Button>

    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your Nickname</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>you can use your nickname!</Text>
          <Text>but also can use random animal nickname!</Text>
          <Input
            placeholder={props.randomName}
            onChange={props.handleInputNickName}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={props.onClickCreateParty}>
            Create!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Flex>
);

export default HomePresentation;

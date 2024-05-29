import { useContext, useEffect, useRef, useState } from "react";
import { Member, Party } from "../../Interfaces/interfaces";
import {
  Heading,
  Text,
  Flex,
  Spacer,
  Button,
  Stack,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@chakra-ui/react";

interface PartyPresentationProps {
  party: Party;
  currentMember: Member;
  onClickCreateReceipt: () => void;
  onClickChangeCurrentMember: () => void;
  onClickAddMember: () => void;
}

const ClickedButton: React.FC<{
  element: string;
  clickHandler: () => void;
}> = ({ element, clickHandler }) => {
  return (
    <Button
      onClick={clickHandler}
      border="1px"
      borderColor="teal"
      colorScheme="teal"
      variant="solid"
    >
      {element}
    </Button>
  );
};
const UnClickedButton: React.FC<{
  element: string;
  clickHandler: () => void;
}> = ({ element, clickHandler }) => {
  return (
    <Button onClick={clickHandler} colorScheme="teal" variant="outline">
      {element}
    </Button>
  );
};

const copyToClipboard = () => {
  const url = window.location.href;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert("URL이 복사되었습니다: " + url);
    })
    .catch((err) => {
      console.error("복사 실패: ", err);
    });
};

const PartyPresentation = (props: PartyPresentationProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnDrawer = useRef<HTMLButtonElement | null>(null);

  return (
    <div>
      <Flex verticalAlign="center">
        <Heading as="h2" size="xl">
          {props.party.partyName}
          {"\u00B7"}
        </Heading>
        <Text fontSize="2xl">{props.party.members.length}명</Text>
        <Spacer />
        <Button ref={btnDrawer} colorScheme="teal" onClick={onOpen}>
          Open
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnDrawer}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {props.currentMember.name}님의
              <Heading as="h2" size="xl">
                {props.party.partyName}
              </Heading>
              <VStack direction="row" spacing={1} align="flex-start">
                {props.party.members?.map((member) => (
                  <Button
                    onClick={props.onClickChangeCurrentMember}
                    colorScheme="gray"
                    variant="ghost"
                  >
                    {member}
                  </Button>
                ))}
                <Button colorScheme="gray" variant="ghost">
                  멤버 추가
                </Button>
              </VStack>
            </DrawerHeader>
            <DrawerBody>
              <Button
                colorScheme="gray"
                variant="ghost"
                w="100%"
                h="48px"
                onClick={copyToClipboard}
              >
                URL 복사하기
              </Button>
              <Button colorScheme="gray" variant="ghost" w="100%" h="48px">
                현재까지 정산 기록보기
              </Button>
            </DrawerBody>
            <DrawerFooter>
              <Button colorScheme="red" variant="solid" w="100%" h="48px">
                여행 끝내기
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>

      <div onClick={props.onClickCreateReceipt}>create Reciept</div>
      <div>멤버</div>
      {props.party.members.map((member, index) => {
        return <div key={index}>{member}</div>;
      })}
      <div onClick={props.onClickAddMember}>add member</div>
      <div>receipts</div>
      {props.party.receipts.map((receipt, index) => {
        return <div key={index}>{receipt.receiptName}</div>;
      })}
    </div>
  );
};

export default PartyPresentation;

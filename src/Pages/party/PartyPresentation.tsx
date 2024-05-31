import { useContext, useEffect, useRef, useState } from "react";
import { Currency, Party, Receipt, Tag } from "../../Interfaces/interfaces";
import {
  Heading,
  Text,
  Input,
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Container,
} from "@chakra-ui/react";

interface PartyPresentationProps {
  party: Party;
  memberList: string[];
  currentMember: string;
  currencyList: Currency[];
  tagList: Tag[];
  onClickCreateReceipt: () => void;
  onClickChangeCurrentMember: (member: string) => void;
  onClickAddMember: () => void;
  onClickChangeCurrency: (index: number) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  btnDrawer: React.RefObject<HTMLButtonElement>;
  onChangeCostInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeNameInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cost: number;
  setCost: (cost: number) => void;
  useCurrency: Currency;
  setUseCurrency: (useCurrency: Currency) => void;
  receiptName: string;
  setReceiptName: (receiptName: string) => void;
  tag: Tag | undefined;
  setTag: (tag: Tag | undefined) => void;
  join: string[];
  setJoin: (join: string[]) => void;
  addJoin: (index: number) => void;
  deleteJoin: (index: number) => void;
  isOpenReceipt: boolean;
  onOpenReceipt: () => void;
  onCloseReceipt: () => void;
  btnReceipt: React.RefObject<HTMLButtonElement>;
  receiptDetail: Receipt | undefined;
  setReceiptDetail: (receipt: Receipt) => void;
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

const PartyPresentation = (props: PartyPresentationProps) => (
  <div>
    <Flex verticalAlign="center">
      <Heading as="h2" size="xl">
        {props.party.partyName}
        {"\u00B7"}
      </Heading>
      <Text fontSize="2xl">{props.party.members.length}명</Text>
      <Spacer />
      <Button ref={props.btnDrawer} colorScheme="teal" onClick={props.onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={props.isOpen}
        placement="right"
        onClose={props.onClose}
        finalFocusRef={props.btnDrawer}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {props.currentMember}님의
            <Heading as="h2" size="xl">
              {props.party.partyName}
            </Heading>
            <VStack direction="row" spacing={1} align="flex-start">
              {props.party.members?.map((member, index) => {
                if (member !== props.currentMember) {
                  return (
                    <Button
                      key={index}
                      onClick={() => props.onClickChangeCurrentMember(member)}
                      colorScheme="gray"
                      variant="ghost"
                    >
                      {member}
                    </Button>
                  );
                }
              })}
              <Button
                onClick={props.onClickAddMember}
                colorScheme="gray"
                variant="ghost"
              >
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
    <Text fontSize="lg">이번 여행에서 소비했어요</Text>
    <Heading as="h2" size="2xl">
      {props.party.totalCost}원
    </Heading>
    <Flex justifyContent="space-between">
      <Input
        value={props.cost}
        onChange={props.onChangeCostInput}
        placeholder={props.useCurrency.country}
        w="70%"
      />

      <Menu>
        <MenuButton textAlign="center" as={Button} width="25%">
          {props.useCurrency.country}
        </MenuButton>
        <MenuList>
          {props.currencyList.map((currency, index) => (
            <MenuItem
              key={index}
              onClick={() => props.onClickChangeCurrency(index)}
            >
              {currency.country}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
    <Input
      value={props.receiptName}
      onChange={props.onChangeNameInput}
      placeholder="소비를 입력해 주세요"
    />
    <Stack direction="row" spacing={4} align="center">
      {props.tagList.map((choiceTag) =>
        choiceTag === props.tag ? (
          <ClickedButton
            element={choiceTag.name}
            clickHandler={() => props.setTag(undefined)}
          ></ClickedButton>
        ) : (
          <UnClickedButton
            element={choiceTag.name}
            clickHandler={() => props.setTag(choiceTag)}
          ></UnClickedButton>
        )
      )}
    </Stack>
    {props.party.members?.length !== 1 ? (
      <Stack direction="row" spacing={4} align="center">
        {props.party.members?.map((member, index) =>
          props.join.find((e: string) => e === member) !== undefined ? (
            <ClickedButton
              element={member}
              clickHandler={() => props.addJoin(index)}
            ></ClickedButton>
          ) : (
            <UnClickedButton
              element={member}
              clickHandler={() => props.deleteJoin(index)}
            ></UnClickedButton>
          )
        )}
      </Stack>
    ) : null}
    <Text>{props.tag === undefined ? "언디파인" : props.tag.name} //test</Text>
    <Button onClick={props.onClickCreateReceipt}>create Receipt</Button>

    {props.party.receipts === undefined
      ? "영수증을 등록해주세요"
      : props.party.receipts.map((receipt) => (
          <Container
            onClick={() => {
              props.setReceiptDetail(receipt);
              props.onOpenReceipt();
            }}
          >
            <Flex justifyContent="space-between">
              <Text fontSize="lg" as="b">
                {receipt.receiptName}
              </Text>
              <Text fontSize="lg" as="b">
                {receipt.author}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text fontSize="lg">
                {receipt.createdAt?.getHours()}:
                {receipt.createdAt?.getMinutes()}
                {receipt.tag}
              </Text>
              <Text fontSize="lg">
                {receipt.useCurrency}
                {receipt.cost}
              </Text>
            </Flex>
          </Container>
        ))}
    <Drawer
      isOpen={props.isOpenReceipt}
      placement="bottom"
      onClose={props.onCloseReceipt}
      finalFocusRef={props.btnReceipt}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader></DrawerHeader>

        <DrawerBody>
          <Text fontSize="2xl">
            {props.receiptDetail?.createdAt?.getFullYear()}년{" "}
            {props.receiptDetail?.createdAt?.getMonth()}월{" "}
            {props.receiptDetail?.createdAt?.getDate()}일
          </Text>
          <Text fontSize="2xl">{props.receiptDetail?.receiptName}과 함께</Text>
          <Button>{props.receiptDetail?.tag}</Button>
          <Text fontSize="2xl">에</Text>
          <Button>{props.receiptDetail?.receiptName}</Button>
          <Button>
            {props.receiptDetail?.useCurrency}{" "}
            {props.receiptDetail?.cost.toLocaleString()}{" "}
          </Button>
          <Text fontSize="2xl">지출</Text>
        </DrawerBody>

        <DrawerFooter>
          <Button colorScheme="orange" variant="solid" w="100%" h="48px">
            영수증 삭제하기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
);

export default PartyPresentation;

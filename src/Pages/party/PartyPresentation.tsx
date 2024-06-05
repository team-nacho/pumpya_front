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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

interface PartyPresentationProps {
  party: Party | undefined;
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
  duplicatedName: () => void;
  copyToClipboard: () => void;
  onClickEndParty: () => void;
  isOpenModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  handleInputNickName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeCostInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeNameInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cost: number;
  setCost: (cost: number) => void;
  useCurrency: Currency;
  setUseCurrency: (useCurrency: Currency) => void;
  receiptName: string;
  setReceiptName: (receiptName: string) => void;
  useTag: Tag | undefined;
  setUseTag: (useTag: Tag | undefined) => void;
  join: string[];
  setJoin: (join: string[]) => void;
  addJoin: (member: string) => void;
  deleteJoin: (member: string) => void;
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
      marginY="5px"
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
    <Button
      onClick={clickHandler}
      colorScheme="teal"
      variant="outline"
      marginY="5px"
    >
      {element}
    </Button>
  );
};

function formatTwoDigits(value: number | undefined): string {
  if (value !== undefined) return value.toString().padStart(2, "0");
  else return "00";
}

const receiptTime = (receiptDetail: Receipt | undefined) => {
  if (!receiptDetail?.createdAt) return null;

  const year = receiptDetail.createdAt.getFullYear();
  const month = receiptDetail.createdAt.getMonth(); // Month is 0-based
  const date = receiptDetail.createdAt.getDate();

  return `${year}년 ${month}월 ${date}일`;
};

const PartyPresentation = (props: PartyPresentationProps) => (
  <div style={{ padding: "10px" }}>
    <Flex verticalAlign="center">
      <Heading as="h2" size="xl">
        {props.party?.partyName}
        {"\u00B7"}
      </Heading>
      <Text fontSize="2xl" marginY="5px">
        {props.party?.members.length}명
      </Text>
      <Spacer />
      <Button
        ref={props.btnDrawer}
        colorScheme="teal"
        onClick={props.onOpen}
        marginY="3px"
        marginLeft="15px"
      >
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
          <DrawerHeader marginY="3px">
            {props.currentMember}님의
            <Heading as="h2" size="xl" marginY="7px">
              {props.party?.partyName}
            </Heading>
            <VStack direction="row" spacing={1} align="flex-start">
              {props.party?.members?.map((member, index) => {
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
                onClick={props.onOpenModal}
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
              onClick={props.copyToClipboard}
            >
              URL 복사하기
            </Button>
            <Button colorScheme="gray" variant="ghost" w="100%" h="48px">
              현재까지 정산 기록보기
            </Button>
          </DrawerBody>
          <DrawerFooter>
            <Button
              onClick={props.onClickEndParty}
              colorScheme="red"
              variant="solid"
              w="100%"
              h="48px"
            >
              여행 끝내기
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
    <Modal isOpen={props.isOpenModal} onClose={props.onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>새로운 맴버를 추가하세요</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>you can use your nickname!</Text>
          <Text>but also can use random animal nickname!</Text>
          <Input
            placeholder={props.nickname}
            onChange={props.handleInputNickName}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              if (
                props.party?.members.find(
                  (member: string) => member === props.nickname
                ) === undefined
              ) {
                props.onClickAddMember();
                props.onClose();
              } else {
                props.duplicatedName();
              }
            }}
          >
            Create!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <Text fontSize="lg" marginY="5px">
      이번 여행에서 소비했어요
    </Text>
    <Heading as="h2" size="2xl" marginTop="5px" marginBottom="20px">
      {props.party?.totalCost}원
    </Heading>
    <Flex justifyContent="space-between">
      <Input
        value={props.cost}
        onChange={props.onChangeCostInput}
        placeholder={props.useCurrency.country}
        marginY="5px"
        w="70%"
      />

      <Menu>
        <MenuButton textAlign="center" as={Button} width="25%" marginY="5px">
          {props.useCurrency.country}
        </MenuButton>
        <MenuList>
          {props.currencyList.map((currency, index) => (
            <MenuItem
              key={currency.currencyId}
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
      marginY="5px"
      placeholder="소비를 입력해 주세요"
    />
    <Stack direction="row" spacing={4} align="center">
      {props.tagList.map((choiceTag) =>
        choiceTag === props.useTag ? (
          <ClickedButton
            key={choiceTag.name}
            element={choiceTag.name}
            clickHandler={() => props.setUseTag(undefined)}
          ></ClickedButton>
        ) : (
          <UnClickedButton
            key={choiceTag.name}
            element={choiceTag.name}
            clickHandler={() => props.setUseTag(choiceTag)}
          ></UnClickedButton>
        )
      )}
    </Stack>
    {props.party?.members?.length !== 1 ? (
      <>
        <Text>누구와 함께 하셨나요?</Text>
        <Stack direction="row" spacing={4} align="center">
          {props.party?.members
            ?.filter((member: string) => member !== props.currentMember)
            .map((member, index) =>
              props.join.find((e: string) => e === member) !== undefined ? (
                <ClickedButton
                  key={`${index}-join`}
                  element={member}
                  clickHandler={() => props.deleteJoin(member)}
                ></ClickedButton>
              ) : (
                <UnClickedButton
                  key={`${index}-notjoin`}
                  element={member}
                  clickHandler={() => props.addJoin(member)}
                ></UnClickedButton>
              )
            )}
        </Stack>
      </>
    ) : null}
    <Button onClick={props.onClickCreateReceipt} marginY="5px">
      create Receipt
    </Button>
    <p></p>
    {props.party?.receipts === undefined || props.party?.receipts.length === 0
      ? "등록된 영수증이 없습니다"
      : props.party.receipts.map((receipt, index) => (
          <Container
            key={index}
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
                {formatTwoDigits(receipt.createdAt?.getHours())}:
                {formatTwoDigits(receipt.createdAt?.getMinutes())}
                {receipt.useTag}
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
          <Text fontSize="2xl">{receiptTime(props.receiptDetail)}</Text>
          <Text fontSize="2xl">{props.receiptDetail?.receiptName}과 함께</Text>
          <Button>{props.receiptDetail?.useTag}</Button>
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

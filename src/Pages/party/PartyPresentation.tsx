import { HamburgerIcon } from "@chakra-ui/icons";
import { Currency, Party, Receipt, Tag } from "../../Interfaces/interfaces";
import CollapseBox from "./CollapseBox"; // 경로에 맞게 파일 경로 설정
import {
  Heading,
  Text,
  Input,
  Flex,
  Button,
  Stack,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { sortReceiptInDate } from "../../Utils/utils";
import ReceiptList from "../../Components/ReceiptList";

interface PartyPresentationProps {
  party: Party | undefined;
  receipts: Receipt[];
  currentMember: string;
  currencyList: Currency[] | undefined;
  tagList: Tag[] | undefined;
  onClickCreateReceipt: () => void;
  onClickChangeCurrentMember: (member: string) => void;
  onClickAddMember: () => void;
  onClickChangeCurrency: (index: number) => void;
  onClickHistory: () => void;
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
  cost: string;
  setCost: (cost: string) => void;
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
  onClickDeleteReceipt: () => void;
  isOpenCollapse: boolean;
  onToggle: () => void;
  randomName: string | undefined;
  totalCost: number;
  setTotalCost: (totalCost: number) => void;
  calculateTotalCost: (receipts: Receipt[], currecnyId: string) => number;
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
      size="xs"
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
      size="xs"
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
  const month = receiptDetail.createdAt.getMonth() + 1; // Month is 0-based
  const date = receiptDetail.createdAt.getDate();

  return `${year}년 ${month}월 ${date}일`;
};

const PartyPresentation = (props: PartyPresentationProps) => (
  <Flex flexDir="column" flex="1">
    <Flex justifyContent="space-between" mb="5">
      <Flex alignItems="center">
        <Heading as="h2" size="xl">
          {props.party?.partyName}
          {"\u00B7"}
        </Heading>

        <Text fontSize="2xl" marginY="5px">
          {props.party?.members?.length}명
        </Text>
      </Flex>
    
      <Button
        ref={props.btnDrawer}
        // colorScheme="teal"
        onClick={props.onOpen}
      >
        <HamburgerIcon/>
      </Button>
    </Flex>

    
    <Modal isOpen={props.isOpenModal} onClose={props.onCloseModal}>
      <ModalOverlay />
      <ModalContent margin="auto" ml="20px" mr="20px">
        <ModalHeader>이름을 입력해주세요</ModalHeader>
        <ModalBody>
          <Input
            placeholder={props.randomName}
            onChange={props.handleInputNickName}
          />
        </ModalBody>

        <ModalFooter >
          <Flex justifyContent="space-between" w="100%">
            <Button 
              colorScheme="red"
              onClick={props.onCloseModal}
            >
              취소
            </Button>
            <Button
              onClick={() => {
                props.onClickAddMember();
                props.onCloseModal();
              }}
            >
              이 이름으로 추가하기
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>

    <Text fontSize="lg" marginY="5px">
      이번 여행에서 소비했어요
    </Text>

    <Menu>
      <MenuButton as={Button} marginY="5px">
        {props.useCurrency.currencyId}
      </MenuButton>
      <MenuList>
        {props.currencyList?.map((currency, index) => (
          <MenuItem
            key={currency.currencyId}
            onClick={() => {
              props.onClickChangeCurrency(index);
              props.setTotalCost(
                props.calculateTotalCost(props.receipts, currency.currencyId)
              );
            }}
          >
            {currency.country}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>

    <Heading as="h2" size="2xl" marginTop="5px" marginBottom="20px">
      {props.totalCost || 0}
      {props.useCurrency.currencyId}
    </Heading>

    <Flex justifyContent="space-between">
      <Input
        value={props.cost}
        onChange={props.onChangeCostInput}
        placeholder={props.useCurrency.currencyId}
        marginY="5px"
        w="70%"
      />

      <Menu>
        <MenuButton textAlign="center" as={Button} width="27%" marginY="5px">
          {props.useCurrency.country}
        </MenuButton>
        <MenuList>
          {props.currencyList?.map((currency, index) => (
            <MenuItem
              key={currency.currencyId}
              onClick={() => {
                props.onClickChangeCurrency(index);
                props.setTotalCost(
                  props.calculateTotalCost(props.receipts, currency.currencyId)
                );
              }}
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
      {props.tagList?.map((choiceTag) =>
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
        <Text fontSize="2xl">누구와 함께 하셨나요?</Text>
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
    <Button
      isDisabled={!props.receiptName || !props.useTag}
      onClick={() => {
        props.onClickCreateReceipt();
        props.setCost("");
        props.setReceiptName("");
      }}
      marginY="9px"
      colorScheme="gray"
      w="100%"
      h="50px"
    >
      등록하기
    </Button>
    {/* 영수증 리스트 */}
    <Flex flexDirection="column" gap="2" mt="5">
      {
        props?.receipts === undefined || props?.receipts.length === 0 ? 
          <Center>
            <Flex flexDir="column" alignItems="center"> 
              <Text>아직 등록된 소비가 없어요</Text>
              <Text fontWeight='bold'>첫 소비를 등록해보세요!</Text>
            </Flex>
          </Center>
        : 
          <ReceiptList
            receipts={sortReceiptInDate(props.receipts)}
            setReceiptDetail={props.setReceiptDetail}
            onOpenReceipt={props.onOpenReceipt}
          />
      }
    </Flex>
    
    {/* 영수증 상세 정보 */}
    <Drawer
      isOpen={props.isOpenReceipt}
      placement="bottom"
      onClose={props.onCloseReceipt}
      finalFocusRef={props.btnReceipt}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader/>
        <DrawerBody>
          <VStack spacing={5} alignItems="left">
            <Text fontSize="2xl">{receiptTime(props.receiptDetail)}</Text>
            <Text fontSize="2xl">{props.receiptDetail?.author}님이</Text>
            {props?.receiptDetail?.joins !== undefined &&
            props?.receiptDetail?.joins.length !== 0 ? (
              <CollapseBox
                title={`${props.receiptDetail.author} 외 ${props?.receiptDetail?.joins.length}인`}
                details={props.receiptDetail?.joins}
              />
            ) : null}
            <Flex>
              <Button>{props.receiptDetail?.useTag}</Button>
              <Text fontSize="2xl">에</Text>
              <Button>{props.receiptDetail?.receiptName}</Button>
            </Flex>
            <Flex>
              <Button>
                {props.receiptDetail?.useCurrency}{" "}
                {props.receiptDetail?.cost.toLocaleString()}{" "}
              </Button>
              <Text fontSize="2xl">지출</Text>
            </Flex>
            
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            onClick={props.onClickDeleteReceipt}
            colorScheme="red"
            variant="solid"
            w="100%"
            h="48px"
          >
            삭제하기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

    {/* 사이드 바 */}
    <Drawer
        isOpen={props.isOpen}
        placement="right"
        onClose={props.onClose}
        finalFocusRef={props.btnDrawer}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader marginY="3px">
            {props.currentMember}님의
            <Heading as="h2" size="xl" marginY="7px">
              {props.party?.partyName}🎉
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
            <Button
              onClick={props.onClickHistory}
              colorScheme="gray"
              variant="ghost"
              w="100%"
              h="48px"
            >
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
);

export default PartyPresentation;

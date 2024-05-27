import { useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import {
  Spacer,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Member, Receipt, Currency, Tag } from "../../Interfaces/interfaces";
import { useAppContext } from "../../AppContext";

const PartyPageContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureReceipt = useDisclosure();
  const isOpenReceipt = disclosureReceipt.isOpen;
  const onOpenReceipt = disclosureReceipt.onOpen;
  const onCloseReceipt = disclosureReceipt.onClose;
  const [receiptDetail, setReceiptDetail] = useState<Receipt>();

  const btnDrawer = useRef<HTMLButtonElement | null>(null);
  const btnReceipt = useRef<HTMLButtonElement | null>(null);

  const party = useAppContext()?.party;
  const { partyId } = useParams();
  const [cost, setCost] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<Member>();
  const [restMembers, setRestMembers] = useState<Member[]>();
  const [membersJoin, setMembersJoin] = useState<boolean[]>();
  const [name, setName] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>();
  const [tag, setTag] = useState<Tag>();
  const [join, setJoin] = useState<string[]>([]);

  const [receipt, setReceipt] = useState<Receipt>({
    partyId: partyId!!,
    name: "",
    author: undefined,
    join: [],
    cost: 0,
    useCurrency: undefined,
    createDate: undefined,
    tag: undefined,
  });
  const [list, setList] = useState<Receipt[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const deleteMemberWithFilter = (memberToDelete: Member) => {
    // const filteredMembers: Member[] = dummyParties[0].member.filter(
    //   (members) => members !== memberToDelete
    // );
    // setRestMembers(filteredMembers);
  };

  /* const onChangeCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceipt({ ...receipt, cost: Number(e.target.value) });
  }; */
  const onChangeCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) setCost(value);
  };
  const onChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onClickSendButton = () => {
    // setReceipt({ ...receipt, name: name, cost: cost });

    const destination = `/pub/receipt/${partyId}`;
    //이 부분은 예시임
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        cost: cost,
        name: name,
        partyId: partyId,
        join: receipt.join,
        author: {
          name: "test name",
          totalCoat: 0,
        },
        useCurrency: receipt.useCurrency,
        tag: tag,
        createdAt: new Date(),
      }),
    });
  };
  const ButtonStackTag: React.FC<{ tags: Tag[] }> = ({ tags }) => {
    return (
      <Stack direction="row" spacing={4} align="center">
        {tags.map((choiceTag) => (
          <Button
            onClick={() =>
              choiceTag === tag ? setTag(undefined) : setTag(choiceTag)
            }
            colorScheme="teal"
            variant={choiceTag === tag ? "solid" : "outline"}
          >
            {choiceTag.name}
          </Button>
        ))}
      </Stack>
    );
  };

  const onClickJoin = (index: number) => {
    if (membersJoin !== undefined) {
      const newArray: boolean[] = [...membersJoin];
      newArray[index] = !newArray[index];
      setMembersJoin(newArray);
    }
  };
  const ButtonStackJoin: React.FC<{ members: Member[] | undefined }> = ({
    members,
  }) => {
    if (members !== undefined && membersJoin !== undefined)
      return (
        <Stack direction="row" spacing={4} align="center">
          {members?.map((member, index) => (
            <Button
              onClick={() => onClickJoin(index)}
              colorScheme="teal"
              variant={membersJoin[index] ? "solid" : "outline"}
            >
              {member.name}
            </Button>
          ))}
        </Stack>
      );
    else return null;
  };

  const ButtonStackMembers: React.FC<{ members: Member[] | undefined }> = ({
    members,
  }) => {
    return (
      <VStack direction="row" spacing={1} align="flex-start">
        {members?.map((member) => (
          <Button
            onClick={() => setCurrentUser(member)}
            colorScheme="gray"
            variant="ghost"
          >
            {member.name}
          </Button>
        ))}
        <Button colorScheme="gray" variant="ghost">
          멤버 추가
        </Button>
      </VStack>
    );
  };

  const MenuItemCurrency: React.FC<Currency> = (currency) => {
    return (
      <MenuItem
        onClick={() => {
          setCurrency(currency);
        }}
      >
        {currency.country}
      </MenuItem>
    );
  };
  const ContainerReceipt: React.FC<Receipt> = (receipt) => {
    if (receipt.author === undefined)
      receipt.author = { name: "", usedCost: 0 };
    return (
      <Container
        onClick={() => {
          setReceiptDetail(receipt);
          onOpenReceipt();
        }}
      >
        <Text fontSize="xl">{receipt.name}</Text>
        <Text fontSize="xl">{receipt.author.name}</Text>
        <Text fontSize="xl">
          {receipt.createDate?.getHours()}:{receipt.createDate?.getMinutes()}
          {receipt.tag?.name}
        </Text>
        <Text fontSize="xl">
          {receipt.useCurrency?.currencyId}
          {receipt.cost}
        </Text>
      </Container>
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

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const stomp = new Client({
          brokerURL: `${process.env.REACT_APP_WS_BASE_URL}/ws`,
          debug: (str: string) => console.log(str),
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });
        setStompClient(stomp);

        stomp.activate();

        stomp.onConnect = () => {
          console.log("WebSocket 연결이 열렸습니다.");

          stomp.subscribe(`/sub/channels/${partyId}`, function (frame) {
            try {
              const parsedMessage = JSON.parse(frame.body);
              setList([...list, parsedMessage]);
              console.log(parsedMessage);
            } catch (err) {
              console.log(err);
            }
          });
        };
      } catch (err) {
        console.log(err);
      }
    };
    initializeChat();

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    // setRestMembers(dummyParties[0].member);
    // deleteMemberWithFilter(currentUser);
    if(party === null) {
      
    }
    setMembersJoin(Array(restMembers?.length).fill(false));
  }, [currentUser]);

  return (
    <div>
      <Flex verticalAlign="center">
        <Heading as="h2" size="xl">
          {party?.partyName}
          {/* {dummyParties[0].name}
          {"\u00B7"} */}
        </Heading>
        {/* <Text fontSize="2xl">{dummyParties[0].member.length}명</Text> */}
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
              {/* {currentUser.name}님의 */}
              <Heading as="h2" size="xl">
                {/* {dummyParties[0].name} */}
              </Heading>
              <ButtonStackMembers members={restMembers} />
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
      {party?.totalCost}원
      </Heading>
      <Flex justifyContent="space-between">
        <Input
          value={cost}
          onChange={onChangeCostInput}
          // placeholder={currency.country}
          w="70%"
        />

        <Menu>
          <MenuButton textAlign="center" as={Button}>
            {/* {currency.country} */}
          </MenuButton>
          {/* <MenuList>
            {currencyList.map((currency) => (
              <MenuItemCurrency {...currency} />
            ))}
          </MenuList> */}
        </Menu>
      </Flex>

      <Input
        value={name}
        onChange={onChangeNameInput}
        placeholder="소비를 입력해 주세요"
      />
      {/* <ButtonStackTag tags={dummyTags} /> */}
      <Text>{tag === undefined ? "언디파인" : tag.name}</Text>
      <ButtonStackJoin members={restMembers} />
      <Button onClick={onClickSendButton}>button</Button>

      {/* {dummyReceipts.map((receipt) => (
        <ContainerReceipt {...receipt} />
      ))} */}
      <Drawer
        isOpen={isOpenReceipt}
        placement="bottom"
        onClose={onCloseReceipt}
        finalFocusRef={btnReceipt}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>

          <DrawerBody>
            <Text fontSize="2xl">
              {receiptDetail?.createDate?.getFullYear()}년{" "}
              {receiptDetail?.createDate?.getMonth()}월{" "}
              {receiptDetail?.createDate?.getDate()}일
            </Text>
            <Text fontSize="2xl">{receiptDetail?.name}과 함께</Text>
            <Text fontSize="2xl">
              {receiptDetail?.tag?.name}에 {receiptDetail?.name}
            </Text>
            <Text fontSize="2xl">
              {receiptDetail?.useCurrency?.currencyId} {receiptDetail?.cost}{" "}
              지출
            </Text>
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
};

export default PartyPageContainer;

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
import {
  dummyReceipts,
  dummyMembers,
  currencyList,
  dummyTags,
  dummyParties,
} from "./dummy";

const PartyPageContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnDrawer = useRef<HTMLButtonElement | null>(null);
  const btnReceipt = useRef<HTMLButtonElement | null>(null);

  const { partyId } = useParams();
  const [cost, setCost] = useState<number>(0);
  //const currentUser = useAppContext();
  const [currentUser, setCurrentUser] = useState<Member>(
    dummyParties[0].member[0]
  );
  const [restMembers, setRestMembers] = useState<Member[]>();
  const [name, setName] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>(currencyList[0]);
  const [tag, setTag] = useState<Tag>();
  const [join, setJoin] = useState<string[]>([]);

  const [receipt, setReceipt] = useState<Receipt>({
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
    const filteredMembers: Member[] = dummyParties[0].member.filter(
      (members) => members !== memberToDelete
    );
    setRestMembers(filteredMembers);
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
  const onClickChoiceUserButton = () => {};
  const onClickSendButton = () => {
    setReceipt({ ...receipt, name: name, cost: cost });
    const destination = `/pub/receipt/${partyId}`;
    //이 부분은 예시임
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        partyId: partyId,
        ...receipt,
        author: {
          name: "test name",
          totalCoat: 0,
        },
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

  const ButtonStackJoin: React.FC<{ members: Member[] | undefined }> = ({
    members,
  }) => {
    return (
      <Stack direction="row" spacing={4} align="center">
        {members?.map((member) => (
          <Button colorScheme="teal" variant="outline">
            {member.name}
          </Button>
        ))}
      </Stack>
    );
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
      <Container>
        <Text fontSize="xl">{receipt.name}</Text>
        <Text fontSize="xl">{receipt.author.name}</Text>
        <Text fontSize="xl"></Text>
        <Text fontSize="xl">{receipt.cost}</Text>
      </Container>
    );
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
    setRestMembers(dummyParties[0].member);
    deleteMemberWithFilter(currentUser);
  }, [currentUser]);
  return (
    <div>
      <Flex verticalAlign="center">
        <Heading as="h2" size="xl">
          {dummyParties[0].name}
          {"\u00B7"}
        </Heading>
        <Text fontSize="2xl">{dummyParties[0].member.length}명</Text>
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
              {currentUser.name}님의
              <Heading as="h2" size="xl">
                {dummyParties[0].name}
              </Heading>
              <ButtonStackMembers members={restMembers} />
            </DrawerHeader>

            <DrawerBody>
              <Button colorScheme="gray" variant="ghost" w="100%" h="48px">
                Open
              </Button>
              <Button colorScheme="gray" variant="ghost" w="100%" h="48px">
                Open
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
        totalAmount원
      </Heading>
      <Input
        value={cost}
        onChange={onChangeCostInput}
        placeholder={currency.country}
      />

      <Menu>
        <MenuButton as={Button}>{currency.country}</MenuButton>
        <MenuList>
          {currencyList.map((currency) => (
            <MenuItemCurrency {...currency} />
          ))}
        </MenuList>
      </Menu>
      <Input
        value={name}
        onChange={onChangeNameInput}
        placeholder="소비를 입력해 주세요"
      />
      <ButtonStackTag tags={dummyTags} />
      <Text>{tag === undefined ? "언디파인" : tag.name}</Text>
      <ButtonStackJoin members={restMembers} />
      <Button onClick={onClickSendButton}>button</Button>

      {dummyReceipts.map((receipt) => (
        <ContainerReceipt {...receipt} />
      ))}
    </div>
  );
};

export default PartyPageContainer;

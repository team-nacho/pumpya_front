import { useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import {
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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Member, Receipt, Currency, Tag } from "../../Interfaces/interfaces";
import { useAppContext } from "../../AppContext";
import { dummyReceipts, dummyMembers, currencyList, dummyTags } from "./dummy";

const PartyPageContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const { partyId } = useParams();
  const [cost, setCost] = useState<number>(0);
  const currentUser = useAppContext();
  const [name, setName] = useState<string>("");
  const [currency, setCurrency] = useState<string>("대한민국");
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
  const ButtonStackTag: React.FC<{ tagList: Tag[] }> = ({ tagList }) => {
    return (
      <Stack direction="row" spacing={4} align="center">
        {tagList.map((choiceTag) => (
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

  const ButtonStackJoin: React.FC<{ memberList: Member[] }> = ({
    memberList,
  }) => {
    return (
      <Stack direction="row" spacing={4} align="center">
        {memberList.map((member) => (
          <Button colorScheme="teal" variant="outline">
            {member.name}
          </Button>
        ))}
      </Stack>
    );
  };
  const MenuItemCurrency: React.FC<Currency> = (currency) => {
    return (
      <MenuItem
        onClick={() => {
          setCurrency(currency.country);
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
  return (
    <div>
      <>
        <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
          Open
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>

            <DrawerBody>
              <Input placeholder="Type here..." />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>

      <Heading as="h2" size="xl">
        partyName
      </Heading>
      <Text fontSize="2xl">memberNum명</Text>
      <Text fontSize="lg">이번 여행에서 소비했어요</Text>
      <Heading as="h2" size="2xl">
        totalAmount원
      </Heading>
      <Input value={cost} onChange={onChangeCostInput} placeholder={currency} />

      <Menu>
        <MenuButton as={Button}>{currency}</MenuButton>
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
      <ButtonStackTag tagList={dummyTags} />
      <Text>{tag === undefined ? "언디파인" : tag.name}</Text>
      <ButtonStackJoin memberList={dummyMembers} />
      <Button onClick={onClickSendButton}>button</Button>

      {dummyReceipts.map((receipt) => (
        <ContainerReceipt {...receipt} />
      ))}
    </div>
  );
};

export default PartyPageContainer;

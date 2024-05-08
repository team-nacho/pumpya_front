import { useContext, useEffect, useRef, useState } from "react";
import Stomp, { Client } from "@stomp/stompjs";
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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Member, Receipt } from "../../Interfaces/interfaces";
import { useAppContext } from "../../AppContext";
import Status from "./Status";
import { dummyReceipts, dummyMembers } from "./dummy";

const PartyPageContainer = () => {
  const currencyList: { currency: string }[] = [
    { currency: "베트남" },
    { currency: "유럽" },
  ];
  const { partyId } = useParams();
  const [cost, setCost] = useState<number>(0);
  const currentUser = useAppContext();
  const [name, setName] = useState<string>("");
  const [currency, setCurrency] = useState<string>("대한민국");
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
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);

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
  const ContainerReceipt: React.FC<Receipt> = (receipt) => {
    if (receipt.author == undefined) receipt.author = { name: "", usedCost: 0 };
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
          <MenuItem
            onClick={() => {
              setCurrency("일본");
            }}
          >
            일본
          </MenuItem>
        </MenuList>
      </Menu>
      <Input
        value={name}
        onChange={onChangeNameInput}
        placeholder="소비를 입력해 주세요"
      />
      <Button onClick={onClickSendButton}>button</Button>

      <Button
        onClick={onClickChoiceUserButton}
        colorScheme="teal"
        variant="outline"
      >
        Button
      </Button>
      {dummyReceipts.map((receipt) => (
        <ContainerReceipt {...receipt} />
      ))}
    </div>
  );
};

export default PartyPageContainer;

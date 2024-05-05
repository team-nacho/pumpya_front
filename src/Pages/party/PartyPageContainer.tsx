import { useContext, useEffect, useRef, useState } from "react";
import Stomp, { Client } from "@stomp/stompjs";
import {
  Heading,
  Text,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Member, Reciept } from "../../Interfaces/interfaces";
import { useAppContext } from "../../AppContext";

const PartyPageContainer = () => {
  const { partyId } = useParams();
  const [cost, setCost] = useState<number>(0);
  const currentUser = useAppContext();
  const [name, setName] = useState<string>("");
  const [currency, setCurrency] = useState<string>("대한민국");
  const [receipt, setReceipt] = useState<Reciept>({
    name: "",
    author: undefined,
    join: [],
    cost: 0,
    currency: "",
    createDate: undefined,
  });
  const [list, setList] = useState<Reciept[]>([]);
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);

  /* const onChangeCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceipt({ ...receipt, cost: Number(e.target.value) });
  }; */
  const onChangeCostInput = (valueAsString: string, valueAsNumber: number) => {
    setCost(valueAsNumber);
  };
  const onChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onClickSendButton = () => {
    setReceipt({ ...receipt, name: name, cost: cost, currency: currency });
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
        파티 이름
      </Heading>
      <Text fontSize="2xl">n 명</Text>
      <Text fontSize="lg">이번 여행에서 소비했어요</Text>
      <Heading as="h2" size="2xl">
        0000원
      </Heading>
      <NumberInput value={cost} onChange={onChangeCostInput} min={0}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Menu>
        <MenuButton as={Button}>{currency}</MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              setCurrency("유럽");
            }}
          >
            유럽
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCurrency("베트남");
            }}
          >
            베트남
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCurrency("대한민국");
            }}
          >
            대한민국
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCurrency("미국");
            }}
          >
            미국
          </MenuItem>
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
    </div>
  );
};

export default PartyPageContainer;

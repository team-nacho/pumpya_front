import { useParams } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import PartyPresentation from "./PartyPresentation";
import { useEffect, useState } from "react";
import { Currency, Member, Party, Receipt, Tag } from "../../Interfaces/interfaces";
import { Client } from "@stomp/stompjs";

const PartyContainer = () => {
  const { partyId } = useParams();
  const contexts = useAppContext();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [tag, setTag] = useState<Tag | undefined>(undefined);
  const [receipts, setReceipts] = useState<Receipt>({
    partyId: partyId!!,
    name: "",
    author: contexts.currentMember,
    join: [],
    cost: 0,
    useCurrency: undefined,
    createDate: undefined,
    tag: undefined,
  });
  const [join, setJoin] = useState<Member[]>([]); // [Member, Member, Member
  const [useCurrency, setUseCurrency] = useState<Currency>({
    currencyId: "KRW",
    country: "대한민국",
  });
  const saveReceipt = () => {
    const destination = `/pub/receipt/${partyId}`;
    //이 부분은 예시임
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        ...receipts
      }),
    });
  }
  const onClickCreateReceipt = () => {
    //영수증에 들어갈 내용 추합
    setReceipts((prev: Receipt) => {
      return {
        ...prev,
        join: join,
        createDate: new Date(),
        tag: tag,
        useCurrency: useCurrency,
      }
    });
    saveReceipt();
  }
  //stomp
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
              //새로운 영수증이 들어오면 추가
              contexts.setParty((prev: Party) => {
                return {
                  ...prev,
                  receipts: [...prev.receipts, parsedMessage],
                };
              });
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
  });

  //get party data
  useEffect(() => {
    if(contexts.party === undefined) {
      //get partyId with partyId
      //만약에 다른 방에 있다가 들어오면 해당 유저가 존재하지 않는 경우일 수 있음
      //이 경우 해당 방에 있는 유저를 선택하도록 모달을 띄워줘야함
    
      //useEffect 실행 순서 제어해야함. 로컬 유저 판단 -> 방 활성화 판단 -> 방 정보 할당 -> 소켓연결
      const localCurrentMember = localStorage.getItem("pumpya_user_name");
      const testParty: Party = {
        partyId: partyId!!,
        partyName: "test",
        members: [
          {name: "test", usedCost: 0},
          {name: "test2", usedCost: 0},
          {name: "test3", usedCost: 0},
        ],
        receipts: [],
        totalCost: 0
      }
      contexts.setParty(testParty);
      contexts.setCurrentMember(localCurrentMember);
      contexts.setLoading(false);
    }
  })
  return (
    <>
    {
      contexts.loading ? 
        <div>loading...</div> : 
        <PartyPresentation 
          party={contexts.party}
          onClickCreateReceipt={onClickCreateReceipt}
        />
    }
    </>
  );
};

export default PartyContainer;
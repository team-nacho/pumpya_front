import { useParams } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import PartyPresentation from "./PartyPresentation";
import { useEffect, useState, useRef } from "react";
import { useDisclosure } from "@chakra-ui/react";
import {
  Currency,
  Member,
  Party,
  Receipt,
  Tag,
} from "../../Interfaces/interfaces";
import { Client } from "@stomp/stompjs";
import { partyApi } from "../../Apis/apis";
import {
  dummyMembers,
  dummyParty,
  dummyReceipts,
  dummyTags,
  dummyCurrencies,
} from "./dummy";
import { tagList, currencyList } from "./datafile";

const PartyContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureReceipt = useDisclosure();
  const isOpenReceipt = disclosureReceipt.isOpen;
  const onOpenReceipt = disclosureReceipt.onOpen;
  const onCloseReceipt = disclosureReceipt.onClose;
  const [receiptDetail, setReceiptDetail] = useState<Receipt>();
  const btnDrawer = useRef<HTMLButtonElement | null>(null);
  const btnReceipt = useRef<HTMLButtonElement | null>(null);

  const { partyId } = useParams();
  const contexts = useAppContext();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [cost, setCost] = useState<number>(0);
  const [receiptName, setReceiptName] = useState<string>("");
  const [tag, setTag] = useState<Tag | undefined>(undefined);
  const [receipt, setReceipt] = useState<Receipt>({
    partyId: partyId!!,
    receiptName: "ttt",
    author: contexts.currentMember,
    joins: [],
    cost: 0,
    useCurrency: undefined,
    createdAt: undefined,
    tag: undefined,
  });
  const [join, setJoin] = useState<Member[]>([]); // [Member, Member,
  const memberList = dummyMembers; //test
  const [useCurrency, setUseCurrency] = useState<Currency>({
    currencyId: "USD",
    country: "미국",
  });
  const onClickAddMember = () => {
    const destination = `/pub/party/${partyId}/new-member`;
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        name: "newMemberName",
      }),
    });
  };
  const onChangeCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) setCost(value);
  };
  const deleteReceipt = () => {
    //파티 아이디와 영수증 아이디를 전달
    const destination = `/pub/receipt/${partyId}/delete`;
  };
  const saveReceipt = () => {
    console.log(receipt);
    const destination = `/pub/party/${partyId}/create`;
    //이 부분은 예시임
    const createdAt = new Date();
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        ...receipt,
        joins: join,
        createdAt: createdAt,
        tag: "testTag",
        useCurrency: useCurrency.currencyId,
      }),
    });
  };
  const onClickCreateReceipt = () => {
    //영수증에 들어갈 내용 추합
    saveReceipt();
  };
  const onClickChangeCurrentMember = (member: string) => {
    //현재 유저를 변경
    contexts.setCurrentMember(
      contexts.party.members.find((e: Member) => e.name === member)
    );
  };
  const onClickChangeCurrency = (index: number) => {
    setUseCurrency(currencyList[index]);
  };
  const onChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiptName(e.target.value);
  };
  //stomp
  const addJoin = (index: number) => {
    const newJoin = [...join];
    newJoin.push(memberList[index]);
    setJoin(newJoin);
  };

  const deleteJoin = (index: number) => {
    const newJoin = [...join];
    newJoin.push(memberList[index]);
    setJoin(newJoin);
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
          // contexts.setLoading(false);
          //영수증 삭제

          //create new member
          stomp.subscribe(`/sub/party/${partyId}/member`, function (frame) {
            try {
              const parsedMessage = JSON.parse(frame.body);
              contexts.setParty((prev: Party) => {
                return {
                  ...prev,
                  members: [...prev.members, parsedMessage],
                };
              });
            } catch (err) {
              console.log(err);
            }
          });
          //create Receipt
          stomp.subscribe(`/sub/receipt/${partyId}`, function (frame) {
            try {
              const parsedMessage = JSON.parse(frame.body);
              //새로운 영수증이 들어오면 추가
              contexts.setParty((prev: Party) => {
                return {
                  ...prev,
                  receipts: [...prev.receipts, parsedMessage],
                };
              });
            } catch (err) {
              console.log(err);
            }
          });
        };
        stomp.onDisconnect = () => {
          console.log("WebSocket 연결이 끊겼습니다.");
          contexts.setLoading(true);
        };
      } catch (err) {
        console.log(err);
      }
    };
    initializeChat();

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
        contexts.setLoading(true);
      }
    };
  }, []);

  //get party data
  useEffect(() => {
    if (contexts.party === undefined) {
      contexts.setLoading(true);
      //get partyId with partyId
      //만약에 다른 방에 있다가 들어오면 해당 유저가 존재하지 않는 경우일 수 있음
      //이 경우 해당 방에 있는 유저를 선택하도록 모달을 띄워줘야함

      //useEffect 실행 순서 제어해야함. 로컬 유저 판단 -> 방 활성화 판단 -> 방 정보 할당 -> 소켓연결
      const localCurrentMember = JSON.parse(
        localStorage.getItem("pumpya_user")!!
      );
      contexts.setCurrentMember(localCurrentMember.pumpya_user_name);
      //현재 서버와 연결되어 있지 않으므로 임시로 테스트 데이터를 넣어줌
      partyApi
        .getParty(partyId!!)
        .then((response) => {
          console.log(response.data);
          contexts.setParty((prev: Party) => {
            return {
              ...prev,
              partyId: response.data.partyId,
              partyName: response.data.partyName,
              members: response.data.members,
              receipts: [],
              totalCost: 0,
            };
          });
          setReceipt((prev: Receipt) => {
            return {
              ...prev,
              author: localCurrentMember.pumpya_user_name,
            };
          });
          contexts.setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [contexts, partyId]);

  return (
    <>
      {contexts.loading ? (
        <div>loading...</div>
      ) : (
        <PartyPresentation
          party={contexts.party}
          memberList={memberList}
          currentMember={contexts.currentMember}
          currencyList={currencyList}
          tagList={tagList}
          onClickCreateReceipt={onClickCreateReceipt}
          onClickChangeCurrentMember={onClickChangeCurrentMember}
          onClickAddMember={onClickAddMember}
          onClickChangeCurrency={onClickChangeCurrency}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          btnDrawer={btnDrawer}
          onChangeCostInput={onChangeCostInput}
          onChangeNameInput={onChangeNameInput}
          cost={cost}
          setCost={setCost}
          useCurrency={useCurrency}
          setUseCurrency={setUseCurrency}
          receiptName={receiptName}
          setReceiptName={setReceiptName}
          tag={tag}
          setTag={setTag}
          join={join}
          setJoin={setJoin}
          addJoin={addJoin}
          deleteJoin={deleteJoin}
          isOpenReceipt={isOpenReceipt}
          onOpenReceipt={onOpenReceipt}
          onCloseReceipt={onCloseReceipt}
          btnReceipt={btnReceipt}
          receiptDetail={receiptDetail}
          setReceiptDetail={setReceiptDetail}
        />
      )}
    </>
  );
};
export default PartyContainer;

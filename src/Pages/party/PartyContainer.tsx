import { useParams } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import PartyPresentation from "./PartyPresentation";
import PartyModal from "./PartyModal";
import { useEffect, useState, useRef } from "react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { Currency, Party, Receipt, Tag } from "../../Interfaces/interfaces";
import { Client } from "@stomp/stompjs";
import { partyApi } from "../../Apis/apis";
import { tagList, currencyList } from "./datafile";
import { useNavigate } from "react-router-dom";

const PartyContainer = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureReceipt = useDisclosure();
  const disclosureModal = useDisclosure();
  const isOpenReceipt = disclosureReceipt.isOpen;
  const onOpenReceipt = disclosureReceipt.onOpen;
  const onCloseReceipt = disclosureReceipt.onClose;
  const isOpenModal = disclosureModal.isOpen;
  const onOpenModal = disclosureModal.onOpen;
  const onCloseModal = disclosureModal.onClose;
  const [receiptDetail, setReceiptDetail] = useState<Receipt>();
  const [isLocalCurrent, setIsLocalCurrent] = useState<boolean>(false);
  const btnDrawer = useRef<HTMLButtonElement | null>(null);
  const btnReceipt = useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const { partyId } = useParams();
  const contexts = useAppContext();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [cost, setCost] = useState<string>("");
  const [receiptName, setReceiptName] = useState<string>("");
  const [useTag, setUseTag] = useState<Tag | undefined>(undefined);
  const [receipt, setReceipt] = useState<Receipt>({
    partyId: partyId!!,
    receiptName: "ttt",
    author: contexts.currentMember,
    joins: [],
    cost: 0,
    useCurrency: undefined,
    createdAt: undefined,
    useTag: undefined,
  });
  const [join, setJoin] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const [useCurrency, setUseCurrency] = useState<Currency>({
    currencyId: "USD",
    country: "미국",
  });
  const onClickAddMember = () => {
    const destination = `/pub/party/${partyId}/new-member`;
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        name: nickname,
      }),
    });
  };
  const duplicatedName = () => {
    toast({
      title: `중복된 이름은 사용할 수 없어요`,
      status: "error",
      isClosable: true,
    });
  };
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: `success copy`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: `error copy`,
          status: "error",
          isClosable: true,
        });
      });
  };
  const handleInputNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  const onChangeCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    //const value = Number(e.target.value);
    // if (!isNaN(value)) setCost(value);

    const value = e.target.value;
    if (/^(\d+\.?\d*|\.\d+)$/.test(value) || value === "") {
      setCost(value);
    }
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
        useTag: "testTag",
        useCurrency: useCurrency.currencyId,
      }),
    });
  };
  const onClickCreateReceipt = () => {
    //영수증에 들어갈 내용 추합
    saveReceipt();
  };
  const onClickChangeCurrentMember = (memberName: string) => {
    //현재 유저를 변경
    const foundMember = contexts.party.members.find(
      (member: string) => member === memberName
    );

    if (foundMember) {
      contexts.setCurrentMember(foundMember);

      const localCurrentMember = {
        pumpya_user_name: memberName,
        pumpya_party_id: contexts.party.partyId,
      };
      localStorage.setItem("pumpya_user", JSON.stringify(localCurrentMember));
    } else {
      console.log("Member not found");
    }
  };
  const onClickSetCurrentMember = (memberName: string) => {
    onClickChangeCurrentMember(memberName);
    setIsLocalCurrent(true);
  };
  const onClickEndParty = () => {
    navigate(`/history/${contexts.party.partyId}`);
  };
  const onClickChangeCurrency = (index: number) => {
    setUseCurrency(currencyList[index]);
  };
  const onChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiptName(e.target.value);
  };
  //stomp
  const addJoin = (addMember: string) => {
    const newJoin = [...join];
    newJoin.push(addMember);
    setJoin(newJoin);
  };

  const deleteJoin = (deleteMember: string) => {
    const newJoin = join.filter((member: string) => member !== deleteMember);
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
          contexts.setLoading(false);
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
              console.log(parsedMessage);
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

          if (localCurrentMember !== null) {
            contexts.setCurrentMember(localCurrentMember.pumpya_user_name);
            //현재 서버와 연결되어 있지 않으므로 임시로 테스트 데이터를 넣어줌
            setIsLocalCurrent(true);
          } else {
            setIsLocalCurrent(false);
          }
          contexts.setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      contexts.setLoading(false);
    }
    if (contexts.currentMember !== undefined) setIsLocalCurrent(true);
  }, [contexts?.party, partyId]);

  useEffect(() => {
    setReceipt((prev: Receipt) => {
      return {
        ...prev,
        author: contexts.currentMember,
      };
    });
    setJoin([]);
  }, [contexts.currentMember]);

  return (
    <>
      {contexts.loading ? (
        <div>loading...</div>
      ) : isLocalCurrent === false ? (
        <PartyModal
          party={contexts.party}
          onClickSetCurrentMember={onClickSetCurrentMember}
        />
      ) : (
        <PartyPresentation
          party={contexts.party}
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
          duplicatedName={duplicatedName}
          copyToClipboard={copyToClipboard}
          onClickEndParty={onClickEndParty}
          isOpenModal={isOpenModal}
          onOpenModal={onOpenModal}
          onCloseModal={onCloseModal}
          nickname={nickname}
          setNickname={setNickname}
          handleInputNickName={handleInputNickName}
          onChangeCostInput={onChangeCostInput}
          onChangeNameInput={onChangeNameInput}
          cost={cost}
          setCost={setCost}
          useCurrency={useCurrency}
          setUseCurrency={setUseCurrency}
          receiptName={receiptName}
          setReceiptName={setReceiptName}
          useTag={useTag}
          setUseTag={setUseTag}
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

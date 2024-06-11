import { unstable_usePrompt, useParams } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import PartyPresentation from "./PartyPresentation";
import PartyModal from "./PartyModal";
import { useEffect, useState, useRef } from "react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { Currency, Party, Receipt, Tag } from "../../Interfaces/interfaces";
import { Client } from "@stomp/stompjs";
import { partyApi, receiptApi, tagApi, currencyApi } from "../../Apis/apis";
import { useNavigate } from "react-router-dom";
import LoadingPresentation from "../../Components/LoadingPresentation";
import ResultContainer from "./ResultContainer";
import { createRandomName } from "../home/randomName";

const PartyContainer = () => {
  const navigate = useNavigate();
  const [tagList, setTagList] = useState<Tag[]>();
  const [currencyList, setCurrencyList] = useState<Currency[]>();
  const [historyComponent, setHistoryComponent] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenCollapse, onToggle } = useDisclosure();
  const {
    isOpen: isOpenReceipt,
    onOpen: onOpenReceipt,
    onClose: onCloseReceipt,
  } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const [randomName, setRandomName] = useState<string>();
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
    receiptId: undefined,
    partyId: partyId!!,
    receiptName: "test recieptName",
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
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [totalCost, setTotalCost] = useState<number>(0);
  const onClickSetCurrentMember = (memberName: string) => {
    onClickChangeCurrentMember(memberName);
    setIsLocalCurrent(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") setNewMemberName(randomName!!);
    else setNewMemberName(e.target.value);
  };
  const onClickAddNewMember = () => {
    if (newMemberName === "") setNewMemberName(randomName!!);
    if (
      contexts.party.members.find(
        (member: string) => member === newMemberName
      ) === undefined
    ) {
      const destination = `/pub/party/${partyId}/new-member`;
      stompClient?.publish({
        destination,
        body: JSON.stringify({
          name: newMemberName,
        }),
      });
      const localCurrentMember = {
        pumpya_user_name: newMemberName,
        pumpya_party_id: partyId,
      };
      localStorage.setItem("pumpya_user", JSON.stringify(localCurrentMember));
      contexts.setCurrentMember(newMemberName);
      createRandomName().then((result: string) => {
        setRandomName(result);
        setNickname(result);
        setNewMemberName(result);
      });
      setIsLocalCurrent(true);
    } else {
      duplicatedName();
    }
  };
  const onClickAddMember = () => {
    if (nickname === "") setNickname(randomName!!);
    if (
      contexts.party.members.find((member: string) => member === nickname) ===
      undefined
    ) {
      const destination = `/pub/party/${partyId}/new-member`;
      stompClient?.publish({
        destination,
        body: JSON.stringify({
          name: nickname,
        }),
      });
      createRandomName().then((result: string) => {
        setRandomName(result);
        setNickname(result);
        setNewMemberName(result);
      });
      onClose();
    } else {
      duplicatedName();
    }
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
          title: `주소가 복사되었습니다`,
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
  const onClickHistory = () => {
    setHistoryComponent(true);
  };
  const handleInputNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") setNickname(randomName!!);
    else setNickname(e.target.value);
  };
  const onChangeCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^(\d+\.?\d*|\.\d+)$/.test(value) || value === "") {
      setCost(value);
    }
  };
  const deleteReceipt = (receiptId: string) => {
    //파티 아이디와 영수증 아이디를 전달
    const destination = `/pub/party/${partyId}/delete`;
    console.log(receiptId);
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        receiptId: receiptId,
      }),
    });
  };
  const onClickDeleteReceipt = () => {
    if (receiptDetail?.receiptId !== undefined)
      deleteReceipt(receiptDetail.receiptId);
    onCloseReceipt();
  };
  const saveReceipt = () => {
    const destination = `/pub/party/${partyId}/create`;
    //이 부분은 예시임
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        ...receipt,
        receiptName: receiptName,
        joins: join,
        cost: cost,
        useTag: useTag!!.name,
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
  const onClickEndParty = () => {
    console.log("종료");
    const destination = `/pub/party/${partyId}/end`;
    //이 부분은 예시임
    stompClient?.publish({
      destination,
      body: JSON.stringify({
        partyId: partyId,
      }),
    });
    navigate(`/history/${partyId}`);
  };
  const onClickChangeCurrency = (index: number) => {
    if (currencyList !== undefined) {
      setUseCurrency(currencyList[index]);
      console.log(useCurrency);
    }
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

  //비용 합산을 계산하는 함수
  const calculateTotalCost = (currencyId: string) => {
    const receipts = contexts.receipts;
    return receipts
      .filter((receipt: Receipt) => receipt.useCurrency === currencyId)
      .reduce((acc: number, receipt: Receipt) => acc + receipt.cost, 0);
  };
  useEffect(() => {
    tagApi.getTags().then((response) => {
      const newTagList = response.data.tags.map((tag) => ({
        name: tag,
      }));
      setTagList(newTagList);
    });
    currencyApi.getCurrencies().then((currencyResponse) => {
      setCurrencyList(currencyResponse.data.currencies);
      console.log(currencyResponse.data.currencies);
    });
    createRandomName().then((result: string) => {
      setRandomName(result);
      setNickname(result);
      setNewMemberName(result);
    });
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
              console.log(frame.body);
              const parsedMessage = JSON.parse(frame.body);
              //새로운 영수증이 들어오면 추가
              const parsedJoin = JSON.parse(parsedMessage.joins);
              const newReceipt: Receipt = {
                ...parsedMessage,
                joins: parsedJoin,
                createdAt: new Date(parsedMessage.createdAt),
              };
              contexts.setReceipts((prev: Receipt[]) => {
                return [...prev, newReceipt];
              });
            } catch (err) {
              console.log(err);
            }
          });
          //delete Receipt
          stomp.subscribe(`/sub/receipt/${partyId}/delete`, function (frame) {
            try {
              console.log(frame.body);
              const receiptId = frame.body;
              //영수증 ID가 들어오면 해당 영수증을 삭제

              contexts.setReceipts((prev: Receipt[]) =>
                prev.filter(
                  (receipt: Receipt) => receipt.receiptId !== receiptId
                )
              );
            } catch (err) {
              console.log(err);
            }
          });
          stomp.subscribe(`/sub/${partyId}/end`, function (frame) {
            try {
              console.log(frame.body);
              //파티가 종료되면 히스토리 페이지로 이동
              navigate(`/history/${partyId}`);
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

  //파티 종료된 상태면 접근 불가하게 만들어야함
  //get party data
  useEffect(() => {
    if (contexts.party === undefined) {
      contexts.setLoading(true);
      //get partyId with partyId
      //useEffect 실행 순서 제어해야함. 로컬 유저 판단 -> 방 활성화 판단 -> 방 정보 할당 -> 소켓연결

      receiptApi
        .getReceipts(partyId!!)
        .then((response) => {
          //console.log(response.data);
          // receipt를 변환하고 새로운 배열을 반환
          const transformedReceipts = response.data.map((receipt) => ({
            ...receipt,
            joins: JSON.parse(receipt.joins),
            createdAt: new Date(receipt.createdAt),
          }));
          // 변환된 배열을 상태에 저장
          contexts.setReceipts(transformedReceipts);
          setTotalCost(
            calculateTotalCost(useCurrency.currencyId)
          );
        })
        .catch((err) => {
          console.log(err);
        });

      const localCurrentMember = JSON.parse(
        localStorage.getItem("pumpya_user")!!
      );
      if (localCurrentMember !== null) {
        contexts.setCurrentMember(localCurrentMember.pumpya_user_name);
        //현재 서버와 연결되어 있지 않으므로 임시로 테스트 데이터를 넣어줌
        setIsLocalCurrent(true);
      } else {
        setIsLocalCurrent(false);
      }
      partyApi
        .getParty(partyId!!)
        .then((response) => {
          // console.log(response.data);
          contexts.setParty((prev: Party) => {
            return {
              ...prev,
              partyId: response.data.partyId,
              partyName: response.data.partyName,
              members: response.data.members,
              totalCost: 0,
              usedCurrencies: response.data.usedCurrencies,
            };
          });
          contexts.setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      contexts.setLoading(false);
    }
    if (contexts.currentMember !== undefined) setIsLocalCurrent(true);
  }, [partyId]);

  useEffect(() => {
    setReceipt((prev: Receipt) => {
      return {
        ...prev,
        author: contexts.currentMember,
      };
    });
    setJoin([]);
  }, [contexts.currentMember]);
  // contexts.receipts 변경 감지하여 totalCost 업데이트
  useEffect(() => {
    setTotalCost(calculateTotalCost(useCurrency.currencyId));
  }, [contexts.receipts, useCurrency.currencyId]);

  return (
    <>
      {contexts.loading ? (
        <LoadingPresentation />
      ) : isLocalCurrent === false ? (
        <PartyModal
          party={contexts.party}
          onClickSetCurrentMember={onClickSetCurrentMember}
          newMemberName={newMemberName}
          setNewMemberName={setNewMemberName}
          handleInputChange={handleInputChange}
          onClickAddNewMember={onClickAddNewMember}
          randomName={randomName}
        />
      ) : !historyComponent ? (
        <PartyPresentation
          party={contexts.party}
          receipts={contexts.receipts}
          currentMember={contexts.currentMember}
          currencyList={currencyList}
          tagList={tagList}
          onClickCreateReceipt={onClickCreateReceipt}
          onClickChangeCurrentMember={onClickChangeCurrentMember}
          onClickAddMember={onClickAddMember}
          onClickChangeCurrency={onClickChangeCurrency}
          onClickHistory={onClickHistory}
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
          onClickDeleteReceipt={onClickDeleteReceipt}
          isOpenCollapse={isOpenCollapse}
          onToggle={onToggle}
          randomName={randomName}
          totalCost={totalCost}
          setTotalCost={setTotalCost}
          calculateTotalCost={calculateTotalCost}
        />
      ) : (
        <ResultContainer
          historyComponent={historyComponent}
          setHistoryComponent={setHistoryComponent}
        />
      )}
    </>
  );
};
export default PartyContainer;

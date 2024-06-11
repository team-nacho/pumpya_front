import { useParams } from "react-router-dom";
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
  const [totalCostsByCurrency, setTotalCostsByCurrency] = useState< Map<string, number> >(new Map());
  const [checkSTOMP, setCheckSTOMP] = useState<boolean>(false);
  const [checkRequest, setCheckRequest] = useState<boolean>(false);


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
    setTimeout(() =>  navigate(`/history/${partyId}`), 1000);
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

  //영수증이 새로 생성되면 해당 통화 총 비용을 계산하는 함수
  const addReceipt = (receipt: Receipt) => {
    //영수증 추가
    contexts.setReceipts((prev: Receipt[]) => [...prev, receipt]); 
    const oldMap = totalCostsByCurrency;
    if(!totalCostsByCurrency.has(receipt.useCurrency!)) oldMap.set(receipt.useCurrency!, 0); 

    const newCost = oldMap.get(receipt.useCurrency!)! + receipt.cost;
    const newMap = totalCostsByCurrency.set(receipt.useCurrency!, newCost);

    setTotalCostsByCurrency(newMap);
  }
  const removeReceipt = (receiptId: string) => {
    const oldMap = totalCostsByCurrency;

    contexts.setReceipts((prev: Receipt[]) => { 
      const foundReceipt = prev.find(receipt => receipt.receiptId === receiptId);
      if (foundReceipt) {
        // 해당 영수증의 통화별 비용을 빼줌
        const newCost = oldMap.get(foundReceipt.useCurrency!)! - foundReceipt.cost;
        const newMap = oldMap.set(foundReceipt.useCurrency!, newCost);
        //만약 통화별 비용이 0이라면 해당 통화를 삭제
        if(newCost === 0) newMap.delete(foundReceipt.useCurrency!);

        setTotalCostsByCurrency(newMap);
      }
      return prev.filter(receipt => receipt.receiptId !== receiptId);
    });
  }
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
          // 웹소켓에 연결된건 로딩 해제 조건이 아님
          // 대신 소켓이 연결이 되었다면 연결 성공 시그널 전달
          console.log("WebSocket 연결이 열렸습니다.");

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
              addReceipt(newReceipt);
            } catch (err) {
              console.log(err);
            }
          });
          //delete Receipt
          stomp.subscribe(`/sub/receipt/${partyId}/delete`, function (frame) {
            try {
              console.log(frame.body);
              const receiptId = frame.body;
              removeReceipt(receiptId); 
            } catch (err) {
              console.log(err);
            }
          });
          stomp.subscribe(`/sub/${partyId}/end`, function (frame) {
            try {
              console.log(frame.body);
              //파티가 종료되면 히스토리 페이지로 이동
              stomp.deactivate();
              setTimeout(() =>  navigate(`/history/${partyId}`), 3000);
             
            } catch (err) {
              console.log(err);
            }
          });
          setCheckSTOMP(true);
        };
        stomp.onDisconnect = () => {
          console.log("WebSocket 연결이 끊겼습니다.");
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

  // 앱 로직 
  // 밑에 해당하는 값 중 하나라도 없다면 로딩
  useEffect(() => {
    if(contexts.party !== undefined 
      && contexts.receipts !== undefined 
      && tagList !== undefined 
      && currencyList !== undefined
      && checkSTOMP)
    {
      contexts.setLoading(false);
      return ;
    }
    if(!checkRequest && contexts.loading) {
      //일단 해당 파티 정보를 미리 불러옴. 유효하지 않은 방 또는 방이 없을 경우 홈으로 이동
      // 유효하지 않은 방을 어떻게 판단할 것인가?
      // 핸덤 이름 생성
      createRandomName().then((result: string) => {
        setRandomName(result);
        setNickname(result);
        setNewMemberName(result);
      });
      partyApi
        .getParty(partyId!!)
        .then((response) => {
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
        })
        .catch((err) => {
          console.log(err);
          navigate("/");
        });
      //receipt 정보를 불러옴
      receiptApi
        .getReceipts(partyId!!)
        .then((response) => {
          // receipt를 변환하고 새로운 배열을 반환
          const transformedReceipts = response.data.map((receipt) => ({
            ...receipt,
            joins: JSON.parse(receipt.joins),
            createdAt: new Date(receipt.createdAt),
          }));
          // 통화별 총 비용을 계산
          console.log(transformedReceipts);
          transformedReceipts.map((receipt) => {  
            addReceipt(receipt);
          });
        })
        .catch((err) => {
          console.log(err);
          navigate("/");
        });

      // 태그와 화폐 정보를 불러옴
      tagApi.getTags().then((response) => {
        const newTagList = response.data.tags.map((tag) => ({
          name: tag,
        }));
        setTagList(newTagList);
      });

      currencyApi.getCurrencies().then((currencyResponse) => {
        setCurrencyList(currencyResponse.data.currencies);
      });

      // 현재 유저가 로컬에 저장되어 있는지 확인
      const localCurrentMember = localStorage.getItem("pumpya_user");

      // 현재 유저가 사용한 적이 있음
      if(localCurrentMember !== null) {
        const parsedLocalCurrentMember = JSON.parse(localCurrentMember);
        // 이 방은 아님
        if(parsedLocalCurrentMember.pumpya_party_id !== partyId) {
          //사용했던 방이 아니면 새로운 유저 또는 다른 방에 다녀온 유저로 인식
          // 사용자 선택 또는 새로운 유저 생성
          setIsLocalCurrent(false);
          contexts.setLoading(false);
        } else {
          // 사용자가 방에 들어온적이 있음 -> 현재 사용자로 설정
          contexts.setCurrentMember(parsedLocalCurrentMember.pumpya_user_name);
          // 모달은 띄우지 않음
          setIsLocalCurrent(true);
        }

      }
      setCheckRequest(true);
    }
    //파티, 영수증, 태그, 화폐 정보가 모두 있다면 로딩 해제
    
  }, [checkSTOMP, contexts.party, contexts.receipts, tagList, currencyList]);

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
        <LoadingPresentation />
      ) : !isLocalCurrent ? (
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
          totalCost={totalCostsByCurrency}
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
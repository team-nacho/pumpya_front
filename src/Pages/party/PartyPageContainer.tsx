import { useContext, useEffect, useRef, useState } from "react";
import Stomp, { Client } from "@stomp/stompjs";
import { Button, Input } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Member, Receipt } from "../../Interfaces/interfaces";
import { useAppContext } from "../../AppContext";

const PartyPageContainer = () => {
  const {partyId} = useParams();
  const [cost, setCost] = useState<number>(0);
  const currentUser = useAppContext();
  const [name, setName] = useState<string>('');
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
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null)

  const onChangeCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceipt({...receipt, cost: Number(e.target.value)});
  }
  const onChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }
  const onClickSendButton = () => {
    const destination = `/pub/receipt/${partyId}`;
    //이 부분은 예시임
    stompClient?.publish({
      destination,
      body:JSON.stringify({
        partyId: partyId,
        ...receipt,
        author: {
          name: 'test name',
          totalCoat: 0
        },
        createdAt: new Date()
      }),
    })
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
        })
        setStompClient(stomp);
  
        stomp.activate();
  
        stomp.onConnect = () => {
          console.log('WebSocket 연결이 열렸습니다.');
  
          stomp.subscribe(
            `/sub/channels/${partyId}`,
            function (frame) {
              try {
                const parsedMessage = JSON.parse(frame.body);
                setList([...list, parsedMessage]);
                console.log(parsedMessage);
              } catch (err) {console.log(err)}
            }
          )
        }
      } catch(err) {console.log(err)}
    }
    initializeChat();
  
    return () => {
      if(stompClient && stompClient.connected) {
        stompClient.deactivate();
      }
    }
  
    
   }, []);
  return (
    <div>
      <Button onClick={onClickSendButton}>
        button
      </Button>
    </div>
  );
}

export default PartyPageContainer;
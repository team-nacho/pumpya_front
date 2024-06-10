import { useEffect, useRef, useState } from "react"
import { withLogging } from "../Utils/withLogging";

const MAX_RETRY_COUNT = 5;
const MIN_INTERVAL = 1000;
const MAX_JITTER = 200;

const ONERROR_CODE = 4000;
const NORMAL_CODE = 1000;

const buildURL = (a: string) => `${process.env.REACT_APP_WS_BASE_URL}/${a}`;
const isWebSocketOpen = (wsInstance: WebSocket) =>
  wsInstance && wsInstance.readyState === WebSocket.OPEN;


export const useWebSocket = (a: string) => {
  const isMounted = useRef<boolean>(true);
  const retryCount = useRef<number>(0);
  const ws = useRef<null | WebSocket>(null);
  const [webSocketData, setWebSocketData] = useState(null);

  useEffect(() => {
    retryCount.current = 0;
    isMounted.current = true;
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(buildURL(a));

    const setupWebSocket = (wsInstance: WebSocket) => {
      wsInstance.onopen = () => {
        retryCount.current = 0;
        withLogging({
          msg: "Connect WS",
          type: "info"
        });
      }

      wsInstance.onmessage = event => {
        if (isMounted.current && isWebSocketOpen(wsInstance)) {
          const resData = JSON.parse(event.data);
          const { type } = resData;
          switch (type) {
            case 'resData':
              setWebSocketData(resData);
              console.info('resData');
              break;
            default:
              withLogging({
                msg: `Sorry, we are out of ${type}.`,
                type: 'info',
              });
          }
        }
      }

      wsInstance.onerror = event => {
        if (isMounted.current) {
          withLogging({ msg: `WebSocket Error:${event}`, type: 'error' });
          wsInstance.close(ONERROR_CODE); //명시적 close 실행 with custom code
        }
      };

      wsInstance.onclose = event => {
        if (isMounted.current) {
          withLogging({
            msg: `WebSocket closed:${(event.code, event.reason)}`,
            type: 'info',
          });

          //retry
          if (event.code !== NORMAL_CODE) {
            if (event.code === ONERROR_CODE) {
              // Exponential Backoff
              let interval = MIN_INTERVAL * Math.pow(2, retryCount.current);

              // Adding Jitter(random)
              const jitter =
                Math.floor(Math.random() * (MAX_JITTER * 2 + 1)) - MAX_JITTER;
              interval += jitter;

              if (retryCount.current < MAX_RETRY_COUNT) {
                setTimeout(() => {
                  ws.current = new WebSocket(buildURL(a));
                  setupWebSocket(ws.current);
                  retryCount.current++;
                }, interval);
              }
            }
          }
        }   
      };
    };
    
    setupWebSocket(ws.current);

    return () => {
      if(ws.current && isWebSocketOpen(ws.current)) {
        console.info('WebSocket 끊김');
        isMounted.current = false;
        ws.current.close();
      }
    };
  }, [a]);

  return { webSocketData, ws };
};
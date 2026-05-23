import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const client = new Client({
  // 불필요한 options 객체와 as any를 모두 제거합니다.
  webSocketFactory: () => new SockJS("https://api.vs.io.kr/ws"),

  reconnectDelay: 5000,

  // 개발 환경(local, dev)에서만 STOMP 디버그 로그를 출력합니다.
  debug: (str) => {
    if (import.meta.env.DEV) {
      console.log(str);
    }
  },
});

export const subscribe = (destination: string, callback: (message: IMessage) => void): StompSubscription => {
  return client.subscribe(destination, callback);
};

export const activate = () => {
  if (!client.active) client.activate();
};

export const deactivate = () => {
  if (client.active) client.deactivate();
};

// 특정 시점에 클라이언트 객체 자체가 필요할 때를 대비해 export
export const getClient = () => client;

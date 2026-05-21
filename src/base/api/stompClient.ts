import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const client = new Client({
  // TS 에러 우회를 위해 옵션 객체에 as any 를 추가합니다.
  webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_WS_BASE_URL ?? "https://api.vs.io.kr"}/ws`, null, {
        withCredentials: true,
      } as any),

  reconnectDelay: 5000,

  // 디버깅을 위해 로깅 추가 (운영 배포 시 제거 또는 조건부 처리)
  debug: (str) => {
    console.log(str);
  },
});

export const subscribe = (
    destination: string,
    callback: (message: IMessage) => void
): StompSubscription => {
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
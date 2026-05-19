import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const client = new Client({
  webSocketFactory: () => new SockJS(`${import.meta.env.VITE_WS_BASE_URL}/ws`),
  reconnectDelay: 5000,
});

export const subscribe = (destination: string, callback: (message: IMessage) => void): StompSubscription =>
  client.subscribe(destination, callback);

export const activate = () => {
  if (!client.active) client.activate();
};
export const deactivate = () => client.deactivate();

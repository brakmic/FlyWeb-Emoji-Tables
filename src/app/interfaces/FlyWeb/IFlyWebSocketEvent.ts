declare type Response = any;
declare type Request = any;

export interface IFlyWebSocketEvent extends Event {
   request: Request;
   accept(protocol?: string): WebSocket;
   respondWith(response: Promise<Response>): void;
}

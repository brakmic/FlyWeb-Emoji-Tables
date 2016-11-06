export declare type Response = any;
export declare type Request = any;

export interface IFlyWebFetchEvent extends Event {
  request: Request;

  respondWith(response: Promise<Response>): void;
};

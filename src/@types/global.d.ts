export default interface Api {
  send: (channel: string, arg: any) => Promise<void | string>;
  on: (channel: string, func: Function) => Promise<void | Function>;
}

declare global {
  interface Window {
    api: Api;
  }
}

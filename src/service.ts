export interface ISyncService {
  // global storage
  // it is guaranteed that the value passed in is able to be handled in JSON
  // but in case you need custom serializer, you can implement your own here
  getItem<T = any>(key: string): T | undefined;
  setItem<T = any>(key: string, value: T): void;

  // broadcast
  // it is guaranteed that the message passed in is able to be handled in JSON
  postMessage<T = any>(message: T): void;
  // optional: in playback mode, it may receive an event with T = { type: 'seeked' }
  addEventListener<T = any>(type: "message", listener: (event: MessageEvent<T>) => void): void;
}

export const channel = new BroadcastChannel("sync-service");

const SameOriginSyncService: ISyncService = {
  getItem<T = any>(key: string) {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : void 0;
  },
  setItem<T = any>(key: string, value: T): void {
    if (value === void 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  postMessage<T = any>(message: T): void {
    channel.postMessage(message);
  },
  addEventListener<T = any>(type: "message", listener: (event: MessageEvent<T>) => void): void {
    channel.addEventListener(type, listener);
  },
};

export default SameOriginSyncService;

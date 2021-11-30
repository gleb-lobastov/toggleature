export interface BaseEventData {
  eventType: string;
  sourcePeerId: string;
  targetPeerId?: string;
}

export type Unlisten = () => void;
export type Listener = (event: MessageEvent<string>) => void;
export type Listen = (handler: Listener) => Unlisten;
export type Broadcast = (message: string) => void;

export interface LowLevelStrategy {
  listen: Listen;
  broadcast: Broadcast;
}

export interface ChannelOptions<EventData extends BaseEventData> {
  channelKey: string;
  onEvent: (eventData: EventData) => void;
  onError?: (error: Error | string) => void;
  lowLevelStrategy?: LowLevelStrategy;
}

export interface Channel<EventData extends BaseEventData> {
  connected: boolean;
  broadcast: (eventData: EventData) => void;
  disconnect: () => void;
}

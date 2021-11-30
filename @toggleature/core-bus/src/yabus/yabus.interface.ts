import { BaseEventData, LowLevelStrategy } from "./connectChannel";
import { StateVariable, MergeStrategy } from "./createStore";

export interface ConnectOptions<State, Updates> {
  channelKey?: string;
  initialState?: State;
  onUpdate?: (payload: UpdateEventPayload<State, Updates>) => void;
  onError?: (error: Error | string) => void;
  mergeStrategy?: MergeStrategy<State, Updates>;
  lowLevelStrategy?: LowLevelStrategy;
}

export interface YabusConnection<State, Updates> {
  connected: boolean;
  state: StateVariable<State>;
  update: (updates: Updates) => boolean;
  reset: (toState: State) => void;
  disconnect: () => void;
}

export enum EventType {
  ACKNOWLEDGE = "ACKNOWLEDGE",
  SYNC = "SYNC",
  RESET = "RESET",
  UPDATE = "UPDATE",
}

export type AcknowledgeEventPayload = null;

export interface SyncEventPayload<State> {
  state: State;
}

export interface UpdateEventPayload<State, Updates> {
  state: State;
  updates: Updates | null;
}

export interface AcknowledgeEventData extends BaseEventData {
  eventType: EventType.ACKNOWLEDGE;
  payload: AcknowledgeEventPayload;
  targetPeerId: string;
}

export interface SyncEventData<State> extends BaseEventData {
  eventType: EventType.SYNC | EventType.RESET;
  payload: SyncEventPayload<State>;
}

export interface UpdateEventData<State, Updates> extends BaseEventData {
  eventType: EventType.UPDATE;
  payload: UpdateEventPayload<State, Updates>;
}

export type StatefulEventData<State, Updates> =
  | AcknowledgeEventData
  | SyncEventData<State>
  | UpdateEventData<State, Updates>;

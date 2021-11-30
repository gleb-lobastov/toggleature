import { stringifyEvent, parseEvent } from "./connectChannel.utils";
import defaultLowLevelStrategy from "./defaultLowLevelStrategy";
import {
  ChannelOptions,
  Channel,
  BaseEventData,
} from "./connectChannel.interface";

export default function connectChannel<EventData extends BaseEventData>({
  channelKey,
  onEvent,
  onError,
  lowLevelStrategy = defaultLowLevelStrategy,
}: ChannelOptions<EventData>): Channel<EventData> {
  let connected = true;

  const unlisten = lowLevelStrategy.listen(handleEvent);

  return {
    get connected() {
      return connected;
    },
    broadcast,
    disconnect: () => {
      connected = false;
      unlisten();
    },
  };

  function handleEvent(event: MessageEvent) {
    const { data: message } = event;
    const eventData = parseEvent<EventData>(channelKey, message, onError);

    if (eventData == null) {
      return;
    }

    onEvent(eventData);
  }

  function broadcast(eventData: EventData) {
    if (!connected) {
      onError?.(`channel "${channelKey}" is not in sync`);
    }
    lowLevelStrategy.broadcast(
      stringifyEvent<EventData>(channelKey, eventData)
    );
  }
}

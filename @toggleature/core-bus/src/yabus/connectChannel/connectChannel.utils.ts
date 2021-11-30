import { EventType } from "../yabus.interface";
import { BaseEventData } from "./connectChannel.interface";

export function stringifyEvent<EventData extends BaseEventData>(
  channelKey: string,
  eventData: EventData
) {
  const { eventType, ...restEventData } = eventData;
  const eventPayloadStr = JSON.stringify(restEventData);
  return `${channelKey}@${eventType}:${eventPayloadStr}`;
}

export function parseEvent<EventData extends BaseEventData>(
  channelKey: string,
  message: string,
  onError?: (message: string) => void
): EventData | null {
  const channelMessage = resolveChannelMessage(message, channelKey);
  if (!channelMessage) {
    return null;
  }

  // split only on first occurrence of delimiter ":", https://stackoverflow.com/a/4607799
  const [eventType, eventPayloadStr] = channelMessage.split(/:(.+)/);

  if (!isValidEventType(eventType)) {
    onError?.(`invalid eventType "${eventType}" in channel "${channelKey}"`);
    return null;
  }

  let restEventData;
  try {
    restEventData = JSON.parse(eventPayloadStr);
  } catch (error) {
    const { message, stack = "" } =
      error instanceof Error ? error : { message: error };
    onError?.(`error occurred during parse: "${message}" ${stack}`);
    return null;
  }

  return {
    ...restEventData,
    eventType,
  };
}

export function isValidEventType(eventType: string): boolean {
  const options: string[] = Object.values(EventType);
  return options.includes(eventType);
}

export function resolveChannelMessage(message: string, channelKey: string) {
  if (message.startsWith && message.startsWith(`${channelKey}@`)) {
    return message.slice(channelKey.length + 1);
  }
  return null;
}

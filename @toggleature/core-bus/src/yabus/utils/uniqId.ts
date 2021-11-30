import { nanoid } from "nanoid";

export const uniqModuleId = nanoid(8);
const counters: Record<PropertyKey, number> = {};
export default function uniqId(entityName: string) {
  if (!counters[entityName]) {
    counters[entityName] = 0;
  }
  return `${uniqModuleId}/${entityName}/${counters[entityName]++}`;
}

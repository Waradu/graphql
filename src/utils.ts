import { GQLField, GQLParam } from "./graphql";
import type { Value } from "./types";

export function indent(level: number) {
  return "  ".repeat(level);
}

export function field(name: string, label?: string) {
  return new GQLField(name, label);
}

export function param(name: string, value: string, string?: true): GQLParam;
export function param(name: string, value: Omit<Value, string>, string?: false): GQLParam;
export function param(
  name: string,
  value: Value,
  string?: boolean
): GQLParam {
  if (string) return new GQLParam(name, '"' + value + '"');
  return new GQLParam(name, value);
}

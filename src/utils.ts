import { GQLNode, GQLNodeParam } from "./graphql";
import type { Value } from "./types";

export function indent(level: number) {
  return "  ".repeat(level);
}

export function node(name: string, label?: string) {
  return new GQLNode(name, label);
}

export function param(name: string, value: string, string?: true): GQLNodeParam;
export function param(name: string, value: Omit<Value, string>, string?: false): GQLNodeParam;
export function param(
  name: string,
  value: Value,
  string?: boolean
): GQLNodeParam {
  if (string) return new GQLNodeParam(name, '"' + value + '"');
  return new GQLNodeParam(name, value);
}

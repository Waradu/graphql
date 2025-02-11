import { GQLField, GQLFragment, GQLParam, GQLQuery } from "./graphql";
import type { RequestType, Value } from "./types";

export function indent(level: number) {
  return "  ".repeat(level);
}

export function query(url: string, children: GQLField[], type: RequestType = "query") {
  return new GQLQuery(url, children, type);
}

export function fragment(name: string, on: string, children: GQLField[]) {
  return new GQLFragment(name, on, children);
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

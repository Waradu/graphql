import { GQLNode, GQLNodeParam } from "./graphql";

export function indent(level: number) {
  return "  ".repeat(level);
}

export function node(name: string, label?: string) {
  return new GQLNode(name, label);
}

export function param(name: string, value: string) {
  return new GQLNodeParam(name, value);
}

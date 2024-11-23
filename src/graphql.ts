import type { RequestType, Value } from "./types";
import { indent } from "./utils";

export class GraphQL {
  private children: GQLField[];
  private url: string;

  constructor(url: string, children: GQLField[]) {
    this.url = url;
    this.children = children;
  }

  async get() {
    return await this.fetch("query");
  }

  async mutate() {
    return await this.fetch("mutation");
  }

  string(requestType?: RequestType): string {
    let string = "";

    if (requestType) {
      string += requestType + " ";
    }

    string += "{\n";

    string += this.children.map((c) => c.string(1)).join("");

    string += "}";

    return string;
  }

  private async fetch<T>(requestType: RequestType) {
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: requestType + " " + this.string() }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        throw new Error(result.errors?.[0]?.message || "GraphQL Error");
      }

      return result.data as T;
    } catch (error: any) {
      console.error("Fetch GraphQL Error:", error.message);
      throw error;
    }
  }
}

export class GQLField {
  private name: string;
  private label: string | null;
  private paramList: GQLParam[] = [];
  private childrenList: GQLField[] = [];

  constructor(name: string, label?: string) {
    this.name = name;
    this.label = label ?? null;
  }

  children(children: GQLField[]) {
    this.childrenList = children;
    return this;
  }

  params(params: GQLParam[]) {
    this.paramList = params;
    return this;
  }

  string(level: number): string {
    let string = "";

    string += indent(level);

    if (this.label) {
      string += this.label + ": ";
    }

    string += this.name;

    if (this.paramList.length > 0) {
      string += "(";

      string += this.paramList.map((p) => p.string()).join(", ");

      string += ")";
    }

    if (this.childrenList.length > 0) {
      string += " {\n";

      string += this.childrenList.map((c) => c.string(level + 1)).join("");

      string += indent(level) + "}";
    }

    return (string += "\n");
  }
}

export class GQLParam {
  private name: string;
  private value: Value;

  constructor(name: string, value: Value) {
    this.name = name;
    this.value = value;
  }

  private stringify = (value: any): string => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return `[${value.map((item) => this.stringify(item)).join(", ")}]`;
      }

      return `{${Object.entries(value)
        .map(([key, val]) => `${key}: ${this.stringify(val)}`)
        .join(", ")}}`;
    }

    return String(value);
  };

  string(): string {
    return this.name + ": " + this.stringify(this.value);
  }
}

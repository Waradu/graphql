import type { RequestType, Value } from "./types";
import { indent } from "./utils";

export class GraphQL {
  private query: GQLQuery;
  private fragments: GQLFragment[];

  constructor(query: GQLQuery, fragments?: GQLFragment[]) {
    this.query = query;
    this.fragments = fragments ?? [];
  }

  string() {
    let string = "";

    string += this.query.string();

    string += "\n\n";

    string += this.fragments.map((c) => c.string()).join("\n\n");

    return string;
  }
}

export class GQLQuery {
  private children: GQLField[];
  private url: string;
  private type: RequestType;

  constructor(url: string, children: GQLField[] = [], type: RequestType = "query") {
    this.url = url;
    this.type = type;
    this.children = children;
  }

  async get<T>() {
    return await this.fetch<T>("query");
  }

  async mutate<T>() {
    return await this.fetch<T>("mutation");
  }

  string(): string {
    let string = `${this.type} `;

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

export class GQLFragment {
  private children: GQLField[];
  private on: string;
  private name: string;

  constructor(name: string, on: string, children: GQLField[]) {
    this.name = name;
    this.on = on;
    this.children = children;
  }

  string(): string {
    let string = `fragment ${this.name} on ${this.on} `;

    string += "{\n";

    string += this.children.map((c) => c.string(1)).join("");

    string += "}";

    return string;
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

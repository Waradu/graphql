import { indent } from "./utils";

export class GraphQL {
  private root;

  constructor(root: GQLNode) {
    this.root = root;
  }

  string(): string {
    let string = "";

    string += "query {\n";

    string += this.root.string(1);

    string += "}";

    return string;
  }
}

export class GQLNode {
  private name: string;
  private label: string | null;
  private paramList: GQLNodeParam[] = [];
  private childrenList: GQLNode[] = [];

  constructor(name: string, label?: string) {
    this.name = name;
    this.label = label ?? null;
  }

  children(children: GQLNode[]) {
    this.childrenList = children;
    return this;
  }

  params(params: GQLNodeParam[]) {
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

export class GQLNodeParam {
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

    if (typeof value === "string") {
      return `"${value}"`;
    }

    return String(value);
  };

  string(): string {
    return this.name + ": " + this.stringify(this.value);
  }
}

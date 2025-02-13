import { indent } from "./src/utils";

interface Animal {
  name: string;
  age: number;
  owner: {
    name: string;
    gender: "M" | "W";
  };
}

interface GQL {
  Animal: Animal;
}

class GQLQuery<T, K extends keyof T> {
  key: K;
  childrenList: GQLQuery<T[K], any>[] = [];

  constructor(key: K) {
    this.key = key;
  }

  children(
    callback: (child: <U extends keyof T[K]>(key: U) => GQLQuery<T[K], U>)
      => Array<GQLQuery<T[K], any>>
  ) {
    const child = <U extends keyof T[K]>(key: U) =>
      new GQLQuery<T[K], U>(key);

    this.childrenList = callback(child);
    return this;
  }

  string(level: number): string {
    let string = "";

    string += indent(level);

    string += this.key as string;

    if (this.childrenList.length > 0) {
      string += " {\n";

      string += this.childrenList.map((c) => c.string(level + 1)).join("");

      string += indent(level) + "}";
    }

    return (string += "\n");
  }
}

function query<T>(key: keyof T) {
  return new GQLQuery<T, typeof key>(key);
}

const q = query<GQL>("Animal").children(child => [
  child("age"),
  child("owner").children(child => [
    child("name"),
    child("gender"),
  ])
]);

console.log(q.string(1));
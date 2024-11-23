# wrdu-graphql

### Install

```bash
bun install wrdu-graphql
```

### Usage

**Basic:**

```ts
const builder = new GraphQL("url", [
  field("Animal").children([
    field("id"),
    field("type"),
    field("name"),
    field("age"),
  ]),
]);

builder.string("query");
```

```graphql
# Result
query {
  Animal {
    id
    type
    name
    age
  }
}
```

<br>

**Params:**

```ts
const builder = new GraphQL("url", [
  field("Animal").children([
    field("id"),
    field("type"),
    field("name"),
    field("age").params([
      param("in", "SECONDS")
    ]),
  ]).params([param("search", "dog", true)]),
]);

builder.string("query");
```

```graphql
# Result
query {
  Animal(search: "dog") {
    id
    type
    name
    age(in: SECONDS)
  }
}
```
```ts
// true at the end means that "dog" should be treated as a string
param("search", "dog", true) // Animal(search: "dog")
param("search", "dog") // Animal(search: dog)
```

<br>

**Labels:**

```ts
const builder = new GraphQL("url", [
  field("Animal").children([
    field("id"),
    field("type", "animalType"),
    field("name"),
    field("age"),
  ]),
]);

builder.string("query");
```

```graphql
# Result
query {
  Animal {
    id
    animalType: type
    name
    age
  }
}
```

<br>

**Request:**

Query:
```ts
const builder = new GraphQL("url", [
  field("Animal").children([
    field("id"),
    field("type"),
    field("name"),
    field("age"),
  ]),
]);

await builder.get<T>();
```

<br>

Mutation:
```ts
const builder = new GraphQL("url", [
  field("createAnimal").children([
    field("id"),
    field("type"),
    field("name"),
    field("age"),
  ]).params([
    param("name", "Biscuit", true),
    param("age", 2),
    param("type", "DOG"),
  ]),
]);

await builder.mutate<T>();
```

<br>

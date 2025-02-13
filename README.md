# wrdu-graphql

### Install

```bash
bun install wrdu-graphql
```

### Usage

**Basic:**

```ts
const gql = new GraphQL(
  query([
    field("Animal").children([
      field("id"),
      field("type"),
      field("name"),
      field("age"),
      field("owner").children([field("name")]),
    ]),
  ])
);
```

```graphql
# Result
query {
  Animal {
    id
    type
    name
    age
    owner {
      name
    }
  }
}
```

<br>

**Params:**

```ts
const gql = new GraphQL(
  query([
    field("Animal")
      .children([
        field("id"),
        field("type"),
        field("name"),
        field("age").params([param("in", "SECONDS")]),
      ])
      .params([param("search", "dog", true)]),
  ])
);
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
param("search", "dog", true); // Animal(search: "dog")
param("search", "dog"); // Animal(search: dog)
```

<br>

**Labels:**

```ts
const gql = new GraphQL(
  query([
    field("Animal").children([
      field("id"),
      field("type", "animalType"),
      field("name"),
      field("age"),
    ]),
  ])
);
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

**Fragments:**

Query:

```ts
const gql = new GraphQL(
  query([field("Animal").children([field("...AnimalFields")])]),
  [
    fragment("AnimalFields", "Animal", [
      field("id"),
      field("type"),
      field("name"),
      field("age"),
    ]),
  ]
);
```

```graphql
# Result
query {
  Animal {
    ...AnimalFields
  }
}

fragment AnimalFields on Animal {
  id
  type
  name
  age
}
```

<br>

**Directives:**

Query:

```ts
const gql = new GraphQL(
  query([
    field("Animal").children([
      field("id"),
      field("type"),
      field("name"),
      field("age"),
      field("owner").children([
        field("name")
      ]),
    ]).params([
      param("name", "$name")
    ]),
  ]).directives("AnimalSearch", [
    param("$name", "String")
  ])
);
```

```graphql
# Result
query AnimalSearch($name: String) {
  Animal(name: $name) {
    id
    type
    name
    age
    owner {
      name
    }
  }
}
```

<br>

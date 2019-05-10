import { struct } from '../../..'

const Person = struct({
  age: 'number',
  nodes: [struct.lazy(() => struct.optional(node))],
})

const Product = struct({
  price: 'string',
})

const map = {
  PERSON: Person,
  PRODUCT: Product,
}

const node = struct({
  kind: struct.enum(Object.keys(map)),
  options: struct.dynamic((value, parent) => {
    return map[parent.kind] || struct('undefined')
  }),
})

export const Struct = struct({
  nodes: [node],
})

export const data = {
  nodes: [
    {
      kind: 'PERSON',
      options: {
        age: 34,
        nodes: [
          {
            kind: 'PERSON',
            options: {
              age: 23,
              nodes: [],
            },
          },
          {
            kind: 'WHOOPS',
            options: {
              price: 'Only $19.99!',
            },
          },
        ],
      },
    },
  ],
}

export const error = {
  path: ['nodes', 0, 'options', 'nodes', 1, 'kind'],
  value: 'WHOOPS',
  type: '"PERSON" | "PRODUCT"',
  reason: undefined,
}

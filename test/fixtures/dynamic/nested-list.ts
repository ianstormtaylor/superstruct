import { struct } from '../../..'

const Container = struct({
  object: struct.literal('CONTAINER'),
  nodes: struct.lazy(() => struct([Struct])),
})

const Leaf = struct({
  object: struct.literal('LEAF'),
  text: 'string',
})

export const Struct = struct.dynamic(value => {
  switch (value.object) {
    case 'CONTAINER':
      return Container
    case 'LEAF':
      return Leaf
    default:
      return struct('undefined')
  }
})

export const data = {
  object: 'CONTAINER',
  nodes: [
    {
      object: 'CONTAINER',
      nodes: [],
    },
    {
      object: 'LEAF',
      text: 'Only $19.99!',
    },
  ],
}

export const output = data

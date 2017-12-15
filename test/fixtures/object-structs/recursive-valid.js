
import { struct } from '../../..'

export const Struct = struct({
  key: 'string',
  children: [struct.lazy(() => Struct)],
})

export const data = {
  key: '1',
  children: [
    {
      key: 'a',
      children: [],
    },
    {
      key: 'b',
      children: [],
    },
  ]
}

export const output = {
  key: '1',
  children: [
    {
      key: 'a',
      children: [],
    },
    {
      key: 'b',
      children: [],
    },
  ]
}

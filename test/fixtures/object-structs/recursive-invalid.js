import { struct } from '../../..'

export const Struct = struct.object({
  key: 'string',
  children: [struct.lazy(() => Struct)],
})

export const data = {
  key: '1',
  children: [
    {
      key: 1,
      children: [],
    },
    {
      key: 'b',
      children: [],
    },
  ],
}

export const error = {
  path: ['children', 0, 'key'],
  value: 1,
  type: 'string',
}

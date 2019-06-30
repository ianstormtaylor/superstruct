import { struct } from '../../..'

export const Struct = struct({
  id: 'number',
  person: struct.interface({
    name: 'string',
    age: 'number',
  }),
})

export const data = {
  id: 1,
}

export const error = {
  path: ['person'],
  value: undefined,
  type: '{name,age}',
  reason: null,
}

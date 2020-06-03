import { struct } from '../../..'

export const Struct = struct({
  id: 'number',
  person: struct.pick({
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
  type: 'pick<{name,age}>',
}

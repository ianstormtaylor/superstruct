import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  nicknames: struct.notEmptyList(['string']),
})

export const data = {
  name: 'John',
  nicknames: [],
}

export const error = {
  path: ['nicknames'],
  value: [],
  type: '[string]',
  reason: null,
}

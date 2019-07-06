import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  nicknames: struct.notEmptyList(['string']),
})

export const data = {
  name: 'John',
  nicknames: ['Johnnie', 'Johnny Boy', 'John-John'],
}

export const output = {
  name: 'John',
  nicknames: ['Johnnie', 'Johnny Boy', 'John-John'],
}

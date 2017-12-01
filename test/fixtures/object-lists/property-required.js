
import { struct } from '../../..'

export const Struct = struct({
  title: 'string',
  tags: struct.required(['string']),
})

export const data = {
  title: 'hello world',
}

export const error = {
  path: ['tags'],
  value: undefined,
  type: 'array',
}

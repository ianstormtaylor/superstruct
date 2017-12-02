
import { struct } from '../../..'

export const Struct = struct({
  title: 'string',
  tags: struct.optional(['string']),
})

export const data = {
  title: 'hello world',
}

export const output = {
  title: 'hello world',
}

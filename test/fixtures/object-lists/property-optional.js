import { struct } from '../../..'

export const Struct = struct.object({
  title: 'string',
  tags: struct.optional(['string']),
})

export const data = {
  title: 'hello world',
}

export const output = {
  title: 'hello world',
}

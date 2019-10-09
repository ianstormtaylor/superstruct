import { struct } from '../../..'

export const Struct = struct.interface({
  name: 'string',
  age: 'number',
})

export const data = {
  name: 'john',
  age: 42,
}

export const output = data


import { struct } from '../../..'

export const Struct = struct.interface({
  name: 'string?',
  age: 'number'
})

export const data = {
  age: 42,
}

export const output = {
  age: 42,
}

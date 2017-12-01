
import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number'
}, {
  name: 'john',
  age: 42,
})

export const data = undefined

export const output = {
  name: 'john',
  age: 42,
}


import { struct } from '../../..'

export const Struct = struct([struct.union([
  { name: 'string', meow: 'string' },
  { name: 'string', bark: 'string' },
])])

export const data = [
  { name: 'cat', meow: 'purrr' },
  { name: 'dog', bark: 'woff' },
  { name: 'bat', flap: 'flpflp' },
]

export const error = {
  path: [2],
  value: { name: 'bat', flap: 'flpflp' },
  type: '{name,meow} | {name,bark}',
}

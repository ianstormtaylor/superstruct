import { record, string, number } from '../../..'

export const Struct = record(string(), number())

export const data = {
  a: 'a',
  b: 'b',
}

export const error = {
  path: ['a'],
  value: 'a',
  type: 'number',
}

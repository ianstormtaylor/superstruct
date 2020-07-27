import { record, string, number } from '../../..'

export const Struct = record(string(), number())

export const data = {
  a: 'a',
  b: 'b',
}

export const failures = [
  {
    value: 'a',
    type: 'number',
    path: ['a'],
    branch: [data, data.a],
  },
  {
    value: 'b',
    type: 'number',
    path: ['b'],
    branch: [data, data.b],
  },
]

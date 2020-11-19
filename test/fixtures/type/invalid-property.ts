import { type, string, number } from '../../..'

export const Struct = type({
  name: string(),
  age: number(),
})

export const data = {
  name: 'john',
  age: 'invalid',
}

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    path: ['age'],
    branch: [data, data.age],
  },
]

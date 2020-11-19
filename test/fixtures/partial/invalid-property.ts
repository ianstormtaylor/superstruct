import { partial, string, number } from '../../..'

export const Struct = partial({
  name: string(),
  age: number(),
})

export const data = {
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

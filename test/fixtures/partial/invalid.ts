import { partial, string, number } from '../../..'

export const Struct = partial({
  name: string(),
  age: number(),
})

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'Partial<{name,age}>',
    path: [],
    branch: [data],
  },
]

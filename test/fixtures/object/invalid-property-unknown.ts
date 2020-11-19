import { object, string, number } from '../../..'

export const Struct = object({
  name: string(),
  age: number(),
})

export const data = {
  name: 'john',
  age: 42,
  unknown: true,
}

export const failures = [
  {
    value: true,
    type: 'never',
    path: ['unknown'],
    branch: [data, data.unknown],
  },
]

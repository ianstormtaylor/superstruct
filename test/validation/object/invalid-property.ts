import { object, string, number } from '../../..'

export const Struct = object({
  name: string(),
  age: number(),
  height: string(),
})

export const data = {
  name: 'john',
  age: 'invalid',
  height: 2,
}

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    refinement: undefined,
    path: ['age'],
    branch: [data, data.age],
  },
  {
    value: 2,
    type: 'string',
    refinement: undefined,
    path: ['height'],
    branch: [data, data.height],
  },
]

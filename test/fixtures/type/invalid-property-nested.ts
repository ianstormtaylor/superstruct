import { type, string, number } from '../../..'

export const Struct = type({
  id: number(),
  person: type({
    name: string(),
    age: number(),
  }),
})

export const data = {
  id: 1,
}

export const failures = [
  {
    value: undefined,
    type: 'Type<{name,age}>',
    path: ['person'],
    branch: [data, undefined],
  },
]

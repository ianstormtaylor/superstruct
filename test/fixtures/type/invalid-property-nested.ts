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

export const error = {
  path: ['person'],
  value: undefined,
  type: 'Type<{name,age}>',
}

import { shape, string, number } from '../../..'

export const Struct = shape({
  id: number(),
  person: shape({
    name: string(),
    age: number(),
  }),
})

export const data = {
  id: 1,
}

export const error = {
  value: undefined,
  type: 'shape',
  refinement: undefined,
  path: ['person'],
  branch: [data, undefined],
}

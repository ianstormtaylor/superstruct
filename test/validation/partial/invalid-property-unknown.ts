import { partial, string, number } from '../../..'

export const Struct = partial({
  name: string(),
  age: number(),
})

export const data = {
  name: 'john',
  unknown: true,
}

export const error = {
  value: true,
  type: 'never',
  refinement: undefined,
  path: ['unknown'],
  branch: [data, data.unknown],
}

import { defaulted, string, type, number } from '../../../src'

export const Struct = defaulted(
  type({
    title: string(),
    version: number(),
  }),
  {
    title: 'Untitled',
  },
  {
    strict: true,
  }
)

export const data = {
  version: 0,
}

export const failures = [
  {
    value: undefined,
    type: 'string',
    refinement: undefined,
    path: ['title'],
    branch: [data, undefined],
  },
]

export const create = true

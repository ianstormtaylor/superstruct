import { number, refine } from '../../..'

export const Struct = refine(
  'positive',
  number(),
  (v) => v > 0 || 'Number was not positive!'
)

export const data = -1

export const failures = [
  {
    value: -1,
    type: 'number',
    refinement: 'positive',
    path: [],
    branch: [data],
  },
]

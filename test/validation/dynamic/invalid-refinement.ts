import { dynamic, number, refine } from '../../..'

export const Struct = dynamic(() =>
  refine(number(), 'positive', (value) => value > 0)
)

export const data = -1

export const failures = [
  {
    type: 'number',
    refinement: 'positive',
    value: -1,
    path: [],
    branch: [data],
  },
]

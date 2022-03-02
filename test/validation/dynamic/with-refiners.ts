import { dynamic, string, nonempty } from '../../..'

export const Struct = dynamic(() => nonempty(string()))

export const data = ''

export const failures = [
  {
    value: data,
    type: 'string',
    refinement: 'nonempty',
    path: [],
    branch: [data],
  },
]

import { lazy, string } from '../../..'

export const Struct = lazy(() => string())

export const data = 3

export const failures = [
  {
    value: 3,
    type: 'string',
    path: [],
    branch: [data],
  },
]

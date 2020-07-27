import { masked, object, string } from '../../..'

export const Struct = masked(object({ name: string() }))

export const data = false

export const failures = [
  {
    type: 'Object<{name}>',
    value: false,
    path: [],
    branch: [data],
  },
]

export const coerce = true

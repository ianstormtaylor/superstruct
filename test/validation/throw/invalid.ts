import { define } from '../../..'

export const Struct = define<string>('email', () => {
  throw Error('validation error')
})

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'email',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]

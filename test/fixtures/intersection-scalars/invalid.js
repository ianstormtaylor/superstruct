import { superstruct } from '../../../lib'

const struct = superstruct({
  types: {
    empty: v => v.length === 0,
  },
})

export const Struct = struct.intersection(['string', 'empty'])

export const data = 'invalid'

export const error = {
  type: 'string & empty',
  value: 'invalid',
  path: [],
}

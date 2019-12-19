import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    empty: v => v.length === 0,
  },
})

export const Struct = struct('string & empty')

export const data = 'a'

export const error = {
  type: 'empty',
  value: 'a',
  path: [],
}

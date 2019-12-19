import { struct } from '../../..'

export const Struct = struct.size([0, 2])

export const data = [1, 2, 3]

export const error = {
  path: [],
  value: [1, 2, 3],
  type: 'size<0,2>',
}

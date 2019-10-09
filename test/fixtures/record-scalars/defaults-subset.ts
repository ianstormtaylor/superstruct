import { struct } from '../../../lib'

export const Struct = struct.record(['string', 'number'], {
  a: 1,
  b: 2,
})

export const data = {
  a: 3,
  c: 5,
}

export const output = {
  a: 3,
  b: 2,
  c: 5,
}

import { struct } from '../../..'

export const Struct = struct.dict(['string', 'number'], {
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

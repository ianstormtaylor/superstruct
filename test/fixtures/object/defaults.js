
import s from '../../..'

export const struct = s({
  name: 'string',
  age: 'number'
}, {
  name: 'john',
  age: 42,
})

export const value = undefined

export const output = {
  name: 'john',
  age: 42,
}

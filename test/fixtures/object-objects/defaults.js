
import { struct as s } from '../../..'

export const struct = s({
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
  }
}, {
  name: 'john',
  age: 42,
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
})

export const value = undefined

export const output = {
  name: 'john',
  age: 42,
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
}

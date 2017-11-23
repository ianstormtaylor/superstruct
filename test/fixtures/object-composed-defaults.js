
import s from '../..'

const address = s({
  street: 'string',
  city: 'string',
})

export const struct = s({
  name: 'string',
  age: 'number',
  address,
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

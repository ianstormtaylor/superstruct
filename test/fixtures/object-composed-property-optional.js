
import s from '../..'

const address = s({
  street: 'string?',
  city: 'string',
})

export const struct = s({
  name: 'string',
  age: 'number',
  address,
})

export const value = {
  name: 'john',
  age: 42,
  address: {
    city: 'springfield',
  }
}

export const output = {
  name: 'john',
  age: 42,
  address: {
    city: 'springfield',
  }
}

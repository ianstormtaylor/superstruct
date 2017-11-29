
import { struct as s } from '../../..'

export const struct = s({
  name: 'string',
  age: 'number',
  address: {
    street: 'string?',
    city: 'string',
  }
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

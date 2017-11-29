
import { struct as s } from '../../..'

const address = s({
  street: 'string?',
  city: 'string',
})

export const struct = s({
  address,
})

export const value = {
  address: {
    city: 'springfield',
  }
}

export const output = {
  address: {
    city: 'springfield',
  }
}

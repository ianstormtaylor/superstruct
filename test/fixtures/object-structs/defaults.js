
import { struct as s } from '../../..'

const address = s({
  street: 'string',
  city: 'string',
})

export const struct = s({
  address,
}, {
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
})

export const value = undefined

export const output = {
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
}

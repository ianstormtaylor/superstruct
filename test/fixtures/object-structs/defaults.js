
import { struct } from '../../..'

const address = struct({
  street: 'string',
  city: 'string',
})

export const Struct = struct({
  address,
}, {
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
})

export const data = undefined

export const output = {
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
}

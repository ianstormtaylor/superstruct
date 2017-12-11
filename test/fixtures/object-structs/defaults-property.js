
import { struct } from '../../..'

const address = struct({
  street: 'string',
  city: 'string',
})

export const Struct = struct({
  name: 'string',
  address,
}, {
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
})

export const data = {
  name: 'Jane Smith',
}

export const output = {
  name: 'Jane Smith',
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
}

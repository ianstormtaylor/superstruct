
import { struct } from '../../..'


export const Struct = struct({
  address: struct.optional([{
    street: 'string',
    city: 'string',
  }]),
})

export const data = {}

data.address = [Object.create(null)]

data.address[0].street = '123 fake st'
data.address[0].city = false

export const error = {
  path: ['address'],
  value: [ { street: '123 fake st', city: false } ],
  type: '[{street,city}] | undefined',
}


import { struct } from '../../..'

export const Struct = struct({
  street: 'string',
  city: 'string',
})

export const data = Object.create(null)
data.street = '123 fake st'
data.city = false

export const error = {
  path: ['city'],
  value: false,
  type: 'string',
}

import { struct } from '../../..'

export const Struct = struct.object({
  street: 'string',
  city: 'string',
})

export const data = Object.create(null)
data.street = '123 fake st'
data.city = 'springfield'

export const output = {
  street: '123 fake st',
  city: 'springfield',
}

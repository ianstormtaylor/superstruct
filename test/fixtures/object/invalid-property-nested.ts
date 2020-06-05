import { object, string } from '../../..'

export const Struct = object({
  name: string(),
  address: object({
    street: string(),
    city: string(),
  }),
})

export const data = {
  name: 'john',
  address: {
    street: 123,
    city: 'Springfield',
  },
}

export const error = {
  path: ['address', 'street'],
  value: 123,
  type: 'string',
}

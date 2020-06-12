import { omit, object, string } from '../../..'

export const Struct = omit(
  object({
    name: string(),
    address: object({
      street: string(),
      city: string(),
    }),
  }),
  ['name']
)

export const data = {
  address: {
    street: '123 Fake St',
    city: 'Springfield',
  },
}

export const output = {
  address: {
    street: '123 Fake St',
    city: 'Springfield',
  },
}

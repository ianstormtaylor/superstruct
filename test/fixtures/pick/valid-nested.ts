import { pick, object, string } from '../../..'

export const Struct = pick(
  object({
    name: string(),
    address: object({
      street: string(),
      city: string(),
    }),
  }),
  ['address']
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

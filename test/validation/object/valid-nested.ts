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
    street: '123 Fake St',
    city: 'Springfield',
  },
}

export const output = {
  name: 'john',
  address: {
    street: '123 Fake St',
    city: 'Springfield',
  },
}

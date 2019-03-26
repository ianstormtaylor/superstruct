import { struct } from '../../..'

const User = struct({
  kind: struct.enum(['USER']),
  display: 'string',
})

const Product = struct({
  kind: struct.enum(['PRODUCT']),
  price: 'string',
})

const map = {
  USER: User,
  PRODUCT: Product,
}

export const Struct = struct.dynamic(entity => {
  return map[entity.kind]
})

export const data = {
  kind: 'PRODUCT',
  price: 'Only $19.99!',
}

export const output = {
  kind: 'PRODUCT',
  price: 'Only $19.99!',
}

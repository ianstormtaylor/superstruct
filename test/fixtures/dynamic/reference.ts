import { struct } from '../../..'

const User = struct({
  object: struct.enum(['USER']),
  username: 'string',
})

const Product = struct({
  object: struct.enum(['PRODUCT']),
  price: 'string',
})

const map = {
  USER: User,
  PRODUCT: Product,
}

export const Struct = struct.dynamic(entity => {
  return map[entity.object]
})

export const data = {
  object: 'PRODUCT',
  price: 'Only $19.99!',
}

export const output = {
  object: 'PRODUCT',
  price: 'Only $19.99!',
}

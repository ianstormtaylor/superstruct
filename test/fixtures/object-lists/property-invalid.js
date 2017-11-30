
import { struct } from '../../..'

export const Struct = struct({
  title: 'string',
  tags: ['string'],
})

export const data = {
  title: 'hello world',
  tags: 'invalid',
}

export const error = {
  code: 'property_invalid',
  type: 'array',
  path: ['tags'],
  key: 'tags',
  value: 'invalid',
}

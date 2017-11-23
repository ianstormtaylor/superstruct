
import s from '../..'

export const struct = s({
  title: 'string',
  tags: ['string'],
})

export const value = {
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

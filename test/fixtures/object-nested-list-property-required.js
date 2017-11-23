
import s from '../..'

export const struct = s({
  title: 'string',
  tags: ['string'],
})

export const value = {
  title: 'hello world',
}

export const error = {
  code: 'property_required',
  type: 'array',
  path: ['tags'],
  key: 'tags',
}

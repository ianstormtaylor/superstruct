
import { struct as s } from '../../..'

export const struct = s({
  title: 'string',
  tags: s.required(['string']),
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

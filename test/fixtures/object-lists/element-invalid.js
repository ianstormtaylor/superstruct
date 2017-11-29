
import { struct as s } from '../../..'

export const struct = s({
  title: 'string',
  tags: ['string'],
})

export const value = {
  title: 'hello world',
  tags: [false],
}

export const error = {
  code: 'element_invalid',
  type: 'string',
  path: ['tags', 0],
  index: 0,
  value: false,
}

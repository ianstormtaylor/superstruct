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
  path: ['tags'],
  value: 'invalid',
  type: '[string]',
}

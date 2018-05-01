import { struct } from '../../..'

export const Struct = struct({
  title: 'string',
  tags: ['string'],
})

export const data = {
  title: 'hello world',
}

export const error = {
  path: ['tags'],
  value: undefined,
  type: '[string]',
  reason: null,
}

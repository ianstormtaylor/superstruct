import { struct } from '../../..'

export const Struct = struct.object({
  title: 'string',
  tags: ['string'],
})

export const data = {
  title: 'hello world',
  tags: [false],
}

export const error = {
  path: ['tags', 0],
  value: false,
  type: 'string',
}

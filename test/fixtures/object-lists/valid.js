import { struct } from '../../..'

export const Struct = struct.object({
  title: 'string',
  tags: ['string'],
})

export const data = {
  title: 'hello world',
  tags: ['news'],
}

export const output = {
  title: 'hello world',
  tags: ['news'],
}

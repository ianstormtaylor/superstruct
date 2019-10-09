import { struct } from '../../..'

export const Struct = struct.object({
  id: 'string|number',
  zip: 'string|number',
})

export const data = {
  id: 1,
  zip: '94203',
}

export const output = {
  id: 1,
  zip: '94203',
}

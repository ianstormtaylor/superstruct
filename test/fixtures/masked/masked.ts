import { masked, object, string } from '../../..'

export const Struct = masked(object({ name: string() }))

export const data = {
  id: '1',
  name: 'Jane',
}

export const output = {
  name: 'Jane',
}

export const coerce = true

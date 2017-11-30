
import { struct } from '../../..'

export const Struct = struct({
  title: 'string',
  tags: struct.required(['string']),
})

export const data = {
  title: 'hello world',
}

export const error = {
  code: 'property_required',
  type: 'array',
  path: ['tags'],
  key: 'tags',
}

import { object, array, string } from '../../..'

export const Struct = object({
  name: string(),
  emails: array(string()),
})

export const data = {
  name: 'john',
  emails: ['name@example.com', false],
}

export const error = {
  path: ['emails', 1],
  value: false,
  type: 'string',
}

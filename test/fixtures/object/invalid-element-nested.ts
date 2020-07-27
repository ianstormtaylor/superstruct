import { object, array, string } from '../../..'

export const Struct = object({
  name: string(),
  emails: array(string()),
})

export const data = {
  name: 'john',
  emails: ['name@example.com', false],
}

export const failures = [
  {
    value: false,
    type: 'string',
    path: ['emails', 1],
    branch: [data, data.emails, data.emails[1]],
  },
]

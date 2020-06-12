import { omit, object, array, string } from '../../..'

export const Struct = omit(
  object({
    name: string(),
    emails: array(string()),
  }),
  ['name']
)

export const data = {
  emails: ['name@example.com', false],
}

export const error = {
  value: false,
  type: 'string',
  path: ['emails', 1],
  branch: [data, data.emails, data.emails[1]],
}

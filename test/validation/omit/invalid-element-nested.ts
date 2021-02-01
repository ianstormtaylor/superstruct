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

export const failures = [
  {
    value: false,
    type: 'string',
    refinement: undefined,
    path: ['emails', 1],
    branch: [data, data.emails, data.emails[1]],
  },
]

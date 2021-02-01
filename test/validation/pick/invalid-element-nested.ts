import { pick, object, array, string } from '../../..'

export const Struct = pick(
  object({
    name: string(),
    emails: array(string()),
  }),
  ['emails']
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

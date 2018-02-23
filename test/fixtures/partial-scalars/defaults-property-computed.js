import { struct } from '../../..'

export const Struct = struct.partial(
  {
    username: 'string',
    email: 'string',
  },
  {
    username: v => v.email.split('@')[0],
  }
)

export const data = {
  name: 'Jane Smith',
  email: 'jane@example.com',
}

export const output = {
  username: 'jane',
  email: 'jane@example.com',
}

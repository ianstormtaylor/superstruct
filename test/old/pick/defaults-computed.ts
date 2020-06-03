import { struct } from '../../..'

export const Struct = struct.pick(
  {
    email: 'string',
    username: 'string',
  },
  {
    username: (v: any) => v.email.split('@')[0],
  }
)

export const data = {
  name: 'Jane Smith',
  email: 'jane@example.com',
}

export const output = {
  email: 'jane@example.com',
  username: 'jane',
}

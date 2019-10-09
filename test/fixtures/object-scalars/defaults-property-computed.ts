import { struct } from '../../..'

export const Struct = struct.object(
  {
    email: 'string',
    username: 'string',
  },
  {
    username: (v: { email: string }) => v.email.split('@')[0],
  }
)

export const data = {
  email: 'jane@example.com',
}

export const output = {
  email: 'jane@example.com',
  username: 'jane',
}

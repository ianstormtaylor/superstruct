
import { struct } from '../../..'

export const Struct = struct({
  username: 'string',
  email: 'string',
}, {
  username: v => v.email.split('@')[0],
})

export const data = {
  email: 'jane@example.com',
}

export const output = {
  username: 'jane',
  email: 'jane@example.com',
}

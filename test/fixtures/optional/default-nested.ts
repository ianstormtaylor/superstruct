import { optional, string, object } from '../../..'

export const Struct = object({
  title: optional(string(), 'Untitled'),
})

export const data = {}

export const output = {
  title: 'Untitled',
}

export const coerce = true

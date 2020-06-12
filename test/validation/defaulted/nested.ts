import { defaulted, string, object } from '../../..'

export const Struct = object({
  title: defaulted(string(), 'Untitled'),
})

export const data = {}

export const output = {
  title: 'Untitled',
}

export const coerce = true

import { deprecated, number, object } from '../../..'

export const Struct = object({
  deprecatedKey: deprecated(number(), () => {}),
})

export const data = {
  deprecatedKey: '42',
}

export const failures = [
  {
    value: '42',
    type: 'number',
    refinement: undefined,
    path: ['deprecatedKey'],
    branch: [data, data.deprecatedKey],
  },
]

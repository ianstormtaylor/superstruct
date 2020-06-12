import { instance } from '../../..'

export const Struct = instance(Array)

export const data = false

export const error = {
  value: false,
  type: 'InstanceOf<Array>',
  path: [],
  branch: [data],
}

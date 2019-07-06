import { struct } from '../../..'

export const Struct = struct.notEmptyList([{ id: 'string?' }])

export const data = [{ id: '1' }, {}, { id: '3' }]

export const output = [{ id: '1' }, {}, { id: '3' }]

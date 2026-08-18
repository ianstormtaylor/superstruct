import { nullable, dynamic, object, literal } from '../../../src'

const User = object({ kind: literal('user') })
const Bot = object({ kind: literal('bot') })

export const Struct = nullable(
  dynamic<any>((value) =>
    (value as { kind?: string }).kind === 'user' ? User : Bot
  )
)

export const data = null

export const output = null

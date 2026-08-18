import { partial, object, dynamic, literal } from '../../../src'

const User = object({ kind: literal('user') })
const Bot = object({ kind: literal('bot') })

export const Struct = partial(
  object({
    entity: dynamic<any>((value) =>
      (value as { kind?: string }).kind === 'user' ? User : Bot
    ),
  })
)

export const data = {}

export const output = {}

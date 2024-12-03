import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { object, string, pattern, refine } from '../../../src'

const Section = pattern(string(), /^\d+(\.\d+)*$/)

test('Invalid object referential', () => {
  const data = {
    section: '1',
    subsection: '2.1',
  }

  const [err, res] = validate(
    data,
    object({
      section: Section,
      subsection: refine(Section, 'Subsection', (value, ctx) => {
        const { branch } = ctx
        const parent = branch[0]
        return value.startsWith(`${parent.section}.`)
      }),
    })
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: '2.1',
      type: 'string',
      refinement: 'Subsection',
      path: ['subsection'],
      branch: [data, data.subsection],
    },
  ])
})

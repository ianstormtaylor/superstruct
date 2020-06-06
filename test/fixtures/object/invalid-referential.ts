import { object, string, pattern, refinement } from '../../..'

const Section = pattern(string(), /^\d+(\.\d+)*$/)

export const Struct = object({
  section: Section,
  subsection: refinement(Section, 'Subsection', (value, ctx) => {
    const { branch } = ctx
    const parent = branch[branch.length - 2]
    return value.startsWith(`${parent.section}.`)
  }),
})

export const data = {
  section: '1',
  subsection: '2.1',
}

export const error = {
  path: ['subsection'],
  value: '2.1',
  type: 'Subsection',
}

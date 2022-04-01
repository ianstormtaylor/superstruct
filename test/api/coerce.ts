import { deepStrictEqual } from 'assert'
import { string, object, union, coerce, date, type, validate } from '../..'

const CoercedDate = coerce(date(), string(), (dateString) => {
  return new Date(dateString)
})

const testDateString = '2021-11-11T11:11:11.111Z'
const expectedDateObject = new Date(testDateString)

describe('coercion', () => {
  it('works on its own', () => {
    const simpleValidationWithoutObject = union([CoercedDate])

    const [, coercedDate] = validate(
      '2021-11-11T11:11:11.111Z',
      simpleValidationWithoutObject,
      {
        coerce: true,
      }
    )
    deepStrictEqual(coercedDate, expectedDateObject)
  })

  it('integrates with type() as expected', () => {
    const simpleValidationWithType = union([
      type({
        createdAt: CoercedDate,
      }),
    ])

    const [, coercedType] = validate(
      { createdAt: '2021-11-11T11:11:11.111Z' },
      simpleValidationWithType,
      { coerce: true }
    )

    deepStrictEqual(coercedType, {
      createdAt: expectedDateObject,
    })
  })

  it('integrates with object() as expected', () => {
    const simpleValidationWithObject = union([
      object({
        createdAt: CoercedDate,
      }),
    ])

    const [error, coercedDateObject] = validate(
      { createdAt: '2021-11-11T11:11:11.111Z' },
      simpleValidationWithObject,
      { coerce: true }
    )

    deepStrictEqual(error, undefined)

    deepStrictEqual(coercedDateObject, {
      createdAt: expectedDateObject,
    })
  })
})

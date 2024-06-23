import { expect, test } from 'vitest'
import { create, defaulted, record, string } from '../src'

test('Defaulted record value is an empty object', () => {
  const DefaultedRecord = defaulted(record(string(), string()), {})

  const recordA = create(undefined, DefaultedRecord)
  const recordB = create(undefined, DefaultedRecord)

  // Shouldn't change recordB
  recordA.name = 'maddy'

  expect(recordB.name).toBeUndefined()
})

test('Defaulted record value is an empty object returned by a function', () => {
  const DefaultedRecordFn = defaulted(record(string(), string()), () => ({}))

  const recordA = create(undefined, DefaultedRecordFn)
  const recordB = create(undefined, DefaultedRecordFn)

  // Shouldn't change recordB
  recordA.name = 'george'

  expect(recordB.name).toBeUndefined()
})

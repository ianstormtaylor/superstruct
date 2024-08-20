import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { type, string } from '../../../src'

class Person {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

test('Valid type', () => {
  const data = new Person('john')

  assert(
    data,
    type({
      name: string(),
    })
  )

  expect(data).toStrictEqual(new Person('john'))
})

import { type, string } from '../../..'

class Person {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

export const Struct = type({
  name: string(),
})

export const data = new Person('john')

export const output = data

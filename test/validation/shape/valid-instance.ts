import { shape, string } from '../../..'

class Person {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

export const Struct = shape({
  name: string(),
})

export const data = new Person('john')

export const output = data

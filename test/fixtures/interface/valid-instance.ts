import { struct } from '../../..'

class Person {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

export const Struct = struct.interface({
  name: 'string',
})

export const data = new Person('john')

export const output = data

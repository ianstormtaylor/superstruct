import { struct } from '../../..'

class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

export const Struct = struct.interface({
  name: 'string',
  age: 'number',
})

export const data = new Person('john', 42)

export const output = {
  name: 'john',
  age: 42,
}

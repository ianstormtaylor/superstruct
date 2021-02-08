import { object, number, string, is } from 'superstruct'

// Define a struct to validate with.
const User = object({
  id: number(),
  name: string(),
  email: string(),
})

// Define data to be validated.
const data = {
  id: 1,
  name: true,
  email: 'jane@example.com',
}

// Test that the data is valid with the `is` helper.
if (is(data, User)) {
  doSomethingWith(data)

  // If you're using TypeScript, the compiler will automatically know that
  // inside this block the `data` object has a shape of:
  //
  // {
  //   id: number
  //   name: string
  //   email: string
  // }
}


Out of the box, Superstruct ships with types for each of the built-in Javascript data types, as well as the special `any` type.

- `any`
- `array`
- `boolean`
- `date`
- `function`
- `null`
- `number`
- `object`
- `string`
- `undefined`

The `any` type matches any value that is not explicitly `undefined` (eg. `value !== undefined`).

But you can also define your own domain-specific types that make writing validations for your use case easier and more specific. For example:

```js
import isEmail from 'is-email'
import isIsodate from 'is-isodate'
import { createStruct } from 'superstruct'

const struct = createStruct({
  types: {
    email: v => isEmail(v),
    isodate: v => isIsodate(v),
  }
})

const validate = struct({
  email: 'email!',
  created_at: 'isodate!',
})

validate({
  email: 'sam@example.com',
  created_at: '2017-11-23T00:56:12+00:00',
})
```

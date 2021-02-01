# Errors

Superstruct throws detailed errors when data is invalid, so that you can build extremely precise errors of your own to give your end users the best possible experience.

### `StructError`

`Error`

```ts
import { StructError } from 'superstruct'

if (error instanceof StructError) {
  ...
}
```

The error class that Superstruct uses for its validation errors. This is exposed primarily as a convenience for checking whether thrown errors are an `instanceof` the `StructError` class.

### Error Properties

Each error thrown includes the following properties:

| **Property** | **Type**                        | **Example**                                                                    | **Description**                                                                                                                                                                                                        |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch`     | `Array<any>`                    | `[{...}, false]`                                                               | An array of the values being validated at every layer. The first element in the array is the root value, and the last element is the current value that failed. This allows you to inspect the entire validation tree. |
| `failures`   | `() => Array<Failure>`          | `[{...}]`                                                                      | All the validation failures that were encountered. The error object always represents the first failure, but you can write more complex logic involving other failures if you need to.                                 |  |
| `key`        | `string \| number \| undefined` | The key of the value when validating complex values like objects, arrays, etc. |
| `path`       | `Array<string \| number>`       | `['address', 'street']`                                                        | The path to the invalid value relative to the root value.                                                                                                                                                              |
| `type`       | `string`                        | `'date'` / `'object'` / …                                                      | The expected type of the invalid value. This is a string of the struct that failed validation (eg. `string`, `date`, `object`).                                                                                        |
| `value`      | `any`                           | `false`                                                                        | The invalid value.                                                                                                                                                                                                     |

### Multiple Errors

The error thrown by Superstruct is always the first validation failure that was encountered, because this makes for convenient and simple logic in the majority of cases. However, the `failures` property is available with a list of all of the validation failures that occurred in case you want to add support for multiple error handling.

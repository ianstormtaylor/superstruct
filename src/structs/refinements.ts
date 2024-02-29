import type { Refiner } from '../struct.js';
import { Struct } from '../struct.js';
import { toFailures } from '../utils.js';

/**
 * Ensure that a string, array, map, or set is empty.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will only accept empty values.
 */
export function empty<
  Type extends string | any[] | Map<any, any> | Set<any>,
  Schema,
>(struct: Struct<Type, Schema>): Struct<Type, Schema> {
  return refine(struct, 'empty', (value) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const size = getSize(value);
    return (
      size === 0 ||
      `Expected an empty ${struct.type} but received one with a size of \`${size}\``
    );
  });
}

/**
 * Get the size of a string, array, map, or set.
 *
 * @param value - The value to measure.
 * @returns The size of the value.
 */
function getSize(value: string | any[] | Map<any, any> | Set<any>): number {
  if (value instanceof Map || value instanceof Set) {
    return value.size;
  }

  return value.length;
}

/**
 * Ensure that a number or date is below a threshold.
 *
 * @param struct - The struct to augment.
 * @param threshold - The maximum value that the input can be.
 * @param options - An optional options object.
 * @param options.exclusive - When `true`, the input must be strictly less than
 * the threshold. When `false`, the input must be less than or equal to the
 * threshold.
 * @returns A new struct that will only accept values below the threshold.
 */
export function max<Type extends number | Date, Schema>(
  struct: Struct<Type, Schema>,
  threshold: Type,
  options: {
    exclusive?: boolean | undefined;
  } = {},
): Struct<Type, Schema> {
  const { exclusive } = options;
  return refine(struct, 'max', (value) => {
    return exclusive
      ? value < threshold
      : value <= threshold ||
          `Expected a ${struct.type} less than ${
            exclusive ? '' : 'or equal to '
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          }${threshold} but received \`${value}\``;
  });
}

/**
 * Ensure that a number or date is above a threshold.
 *
 * @param struct - The struct to augment.
 * @param threshold - The minimum value that the input can be.
 * @param options - An optional options object.
 * @param options.exclusive - When `true`, the input must be strictly greater
 * than the threshold. When `false`, the input must be greater than or equal to
 * the threshold.
 * @returns A new struct that will only accept values above the threshold.
 */
export function min<Type extends number | Date, Schema>(
  struct: Struct<Type, Schema>,
  threshold: Type,
  options: {
    exclusive?: boolean | undefined;
  } = {},
): Struct<Type, Schema> {
  const { exclusive } = options;
  return refine(struct, 'min', (value) => {
    return exclusive
      ? value > threshold
      : value >= threshold ||
          `Expected a ${struct.type} greater than ${
            exclusive ? '' : 'or equal to '
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          }${threshold} but received \`${value}\``;
  });
}

/**
 * Ensure that a string, array, map or set is not empty.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will only accept non-empty values.
 */
export function nonempty<
  Type extends string | any[] | Map<any, any> | Set<any>,
  Schema,
>(struct: Struct<Type, Schema>): Struct<Type, Schema> {
  return refine(struct, 'nonempty', (value) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const size = getSize(value);
    return (
      size > 0 || `Expected a nonempty ${struct.type} but received an empty one`
    );
  });
}

/**
 * Ensure that a string matches a regular expression.
 *
 * @param struct - The struct to augment.
 * @param regexp - The regular expression to match against.
 * @returns A new struct that will only accept strings matching the regular
 * expression.
 */
export function pattern<Type extends string, Schema>(
  struct: Struct<Type, Schema>,
  regexp: RegExp,
): Struct<Type, Schema> {
  return refine(struct, 'pattern', (value) => {
    return (
      regexp.test(value) ||
      `Expected a ${struct.type} matching \`/${regexp.source}/\` but received "${value}"`
    );
  });
}

/**
 * Ensure that a string, array, number, date, map, or set has a size (or length,
 * or time) between `min` and `max`.
 *
 * @param struct - The struct to augment.
 * @param minimum - The minimum size that the input can be.
 * @param maximum - The maximum size that the input can be.
 * @returns A new struct that will only accept values within the given size
 * range.
 */
export function size<
  Type extends string | number | Date | any[] | Map<any, any> | Set<any>,
  Schema,
>(
  struct: Struct<Type, Schema>,
  minimum: number,
  maximum: number = minimum,
): Struct<Type, Schema> {
  const expected = `Expected a ${struct.type}`;
  const of =
    minimum === maximum
      ? `of \`${minimum}\``
      : `between \`${minimum}\` and \`${maximum}\``;

  return refine(struct, 'size', (value) => {
    if (typeof value === 'number' || value instanceof Date) {
      return (
        (minimum <= value && value <= maximum) ||
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${expected} ${of} but received \`${value}\``
      );
    } else if (value instanceof Map || value instanceof Set) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { size } = value;
      return (
        (minimum <= size && size <= maximum) ||
        `${expected} with a size ${of} but received one with a size of \`${size}\``
      );
    }

    const { length } = value;
    return (
      (minimum <= length && length <= maximum) ||
      `${expected} with a length ${of} but received one with a length of \`${length}\``
    );
  });
}

/**
 * Augment a `Struct` to add an additional refinement to the validation.
 *
 * The refiner function is guaranteed to receive a value of the struct's type,
 * because the struct's existing validation will already have passed. This
 * allows you to layer additional validation on top of existing structs.
 *
 * @param struct - The struct to augment.
 * @param name - The name of the refinement.
 * @param refiner - The refiner function.
 * @returns A new struct that will run the refiner function after the existing
 * validation.
 */
export function refine<Type, Schema>(
  struct: Struct<Type, Schema>,
  name: string,
  refiner: Refiner<Type>,
): Struct<Type, Schema> {
  return new Struct({
    ...struct,
    *refiner(value, ctx) {
      yield* struct.refiner(value, ctx);
      const result = refiner(value, ctx);
      const failures = toFailures(result, ctx, struct, value);

      for (const failure of failures) {
        yield { ...failure, refinement: name };
      }
    },
  });
}

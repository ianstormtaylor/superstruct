/**
 * A `StructFailure` represents a single specific failure in validation.
 */

export type Failure = {
  value: any;
  key: any;
  type: string;
  refinement: string | undefined;
  message: string;
  explanation?: string | undefined;
  branch: any[];
  path: any[];
};

/**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */

export class StructError extends TypeError {
  value: any;

  key!: any;

  type!: string;

  refinement!: string | undefined;

  path!: any[];

  branch!: any[];

  failures: () => Failure[];

  [x: string]: any;

  constructor(failure: Failure, failures: () => Generator<Failure>) {
    let cached: Failure[] | undefined;
    const { message, explanation, ...rest } = failure;
    const { path } = failure;
    const cause =
      path.length === 0 ? message : `At path: ${path.join('.')} -- ${message}`;
    super(explanation ?? cause);

    if (explanation !== null && explanation !== undefined) {
      this.cause = cause;
    }

    Object.assign(this, rest);
    this.name = this.constructor.name;
    this.failures = () => {
      return (cached ??= [failure, ...failures()]);
    };
  }
}

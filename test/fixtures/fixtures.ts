import { flatMap, omit, pick, values } from 'lodash'

type AllFixtures = {
  booleans: () => unknown[]
  functions: () => unknown[]
  nulls: () => unknown[]
  strings: () => unknown[]
  undefineds: () => unknown[]
  nan: () => unknown[]
  floats: () => unknown[]
  integers: () => unknown[]
}

export const data: AllFixtures = {
  booleans: () => [true, false],
  functions: () => [
    () => {},
    (a: number, b: number) => a + b,
    function namedFunction() {},
  ],
  nulls: () => [null],
  strings: () => ['Hello', '', '123', 'Special characters: !@#$%^&*()'],
  undefineds: () => [undefined],
  nan: () => [NaN],
  floats: () => [3.14159],
  integers: () => [3, -17, 0, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
}

export const fixtures = {
  all: (): unknown[] => flatMap(values(data), (value) => value()),

  pick: (keys: (keyof AllFixtures)[]): unknown[] =>
    flatMap(values(pick(data, keys)), (value) => value()),

  omit: (keys: (keyof AllFixtures)[]): unknown[] => {
    const arrays: (() => unknown[])[] = values(omit(data, keys))

    return flatMap(arrays, (value) => value())
  },
}

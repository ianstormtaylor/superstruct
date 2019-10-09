/// <reference types="node" />

declare module 'kind-of' {
  interface DateLike {
    toDateString: Function
    getDate: Function
    setDate: Function
  }

  interface RegExpLike {
    flags: string
    ignoreCase: boolean
    multiline: boolean
    global: boolean
  }

  interface GeneratorLike {
    throw: Function
    return: Function
    next: Function
  }

  interface ErrorLike {
    message: string
    constructor: {
      stackTraceLimit: number
    }
  }

  type KindOf<T> = T extends undefined
    ? 'undefined'
    : T extends null
    ? 'null'
    : T extends boolean | Boolean
    ? 'boolean'
    : T extends string | String
    ? 'string'
    : T extends number | Number
    ? 'number'
    : T extends symbol
    ? 'symbol'
    : T extends IterableIterator<any>
    ? 'mapiterator' | 'setiterator' | 'stringiterator' | 'arrayiterator'
    : T extends (...args: any[]) => IterableIterator<any>
    ? 'generatorfunction' | 'function'
    : T extends Function
    ? 'function'
    : T extends Array<any>
    ? 'array'
    : T extends Date | DateLike
    ? 'date'
    : T extends Buffer
    ? 'buffer'
    : T extends Error | ErrorLike
    ? 'error'
    : T extends RegExp | RegExpLike
    ? 'regexp'
    : T extends Promise<any>
    ? 'promise'
    : T extends Map<any, any>
    ? 'map'
    : T extends Set<any>
    ? 'set'
    : T extends WeakMap<any, any>
    ? 'weakmap'
    : T extends WeakSet<any>
    ? 'weakset'
    : T extends Int8Array
    ? 'int8array'
    : T extends Uint8Array
    ? 'uint8array'
    : T extends Uint8ClampedArray
    ? 'uint8clampedarray'
    : T extends Int16Array
    ? 'int16array'
    : T extends Uint16Array
    ? 'uint16array'
    : T extends Int32Array
    ? 'int32array'
    : T extends Uint32Array
    ? 'uint32array'
    : T extends Float32Array
    ? 'float32array'
    : T extends Float64Array
    ? 'float64array'
    : T extends IArguments
    ? 'arguments'
    : T extends GeneratorLike
    ? 'generator'
    : T extends NodeJS.Global
    ? 'global'
    : T extends Window
    ? 'window'
    : T extends object
    ? 'object'
    : string

  function kindOf(): KindOf<undefined>
  function kindOf<T>(v: T): KindOf<T>
  export default kindOf
}

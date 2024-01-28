import { assert, array, number } from '../../src'
import { test } from '../index.test'

test<Array<unknown>>((x) => {
  assert(x, array())
  return x
})

test<Array<number>>((x) => {
  assert(x, array(number()))
  return x
})

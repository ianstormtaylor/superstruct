import { assert, tuple, string, number, literal } from '../..'
import { test } from '..'

test<[string, number]>((x) => {
  assert(x, tuple([string(), number()]))
  return x
})

// Maximum call stack of 41 items
test<
  [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41'
  ]
>((x) => {
  assert(
    x,
    tuple([
      literal('1'),
      literal('2'),
      literal('3'),
      literal('4'),
      literal('5'),
      literal('6'),
      literal('7'),
      literal('8'),
      literal('9'),
      literal('10'),
      literal('11'),
      literal('12'),
      literal('13'),
      literal('14'),
      literal('15'),
      literal('16'),
      literal('17'),
      literal('18'),
      literal('19'),
      literal('20'),
      literal('21'),
      literal('22'),
      literal('23'),
      literal('24'),
      literal('25'),
      literal('26'),
      literal('27'),
      literal('28'),
      literal('29'),
      literal('30'),
      literal('31'),
      literal('32'),
      literal('33'),
      literal('34'),
      literal('35'),
      literal('36'),
      literal('37'),
      literal('38'),
      literal('39'),
      literal('40'),
      literal('41'),
    ])
  )
  return x
})

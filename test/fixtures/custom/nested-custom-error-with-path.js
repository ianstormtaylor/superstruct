
import s from '../../..'

const person = s({
  name: 'string',
  age: 'number',
})

function validatePerson(data) {
  try {
    return person(data)
  } catch (e) {
    const error = new Error('Invalid person object!')
    error.code = `person_${e.key}_invalid`
    error.key = e.key
    error.value = e.value
    error.path = e.path
    throw error
  }
}

export const struct = s({
  person: validatePerson,
})

export const value = {
  person: {
    name: 'jane',
    age: 'invalid',
  }
}

export const error = {
  code: 'person_age_invalid',
  path: ['person', 'age'],
  key: 'age',
  value: 'invalid',
}

const test = require('ava')
const getterCache = require('.')({ cacheKey: '_cacheKey' })

let count = 0

const person = {
  get name() {
    count++
    return 'foo'
  },
  // ignore non-getter property
  hi() {
    count++
    return `my name is ${this.name}`
  }
}

getterCache(person, 'name', 'hi')

test.serial('main', t => {
  t.is(person.name, 'foo')
  t.is(count, 1)
  t.is(person.name, 'foo')
  t.is(count, 1)
  t.is(person.name, 'foo')
  t.is(count, 1)
  t.is(person.name, 'foo')
  t.is(count, 1)
  t.is(person.name, 'foo')
  t.is(count, 1)
  t.is(person.hi(), 'my name is foo')
  t.is(count, 2)
  t.is(person.hi(), 'my name is foo')
  t.is(count, 3)
  t.is(person.hi(), 'my name is foo')
  t.is(count, 4)
})

test.serial('clear cache', t => {
  t.is(count, 4)
  person._cacheKey.name.cached = false
  t.is(person.name, 'foo')
  t.is(count, 5)
})

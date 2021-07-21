const test = require('ava')
const getterCache = require('.')({ cacheKey: '_cacheKey' })


function main(personName, t) {
  const person = t.context[personName]
  t.is(person.name, 'foo')
  t.is(person.count, 1)
  t.is(person.name, 'foo')
  t.is(person.count, 1)
  t.is(person.name, 'foo')
  t.is(person.count, 1)
  t.is(person.name, 'foo')
  t.is(person.count, 1)
  t.is(person.name, 'foo')
  t.is(person.count, 1)
  t.is(person.hi(), 'my name is foo')
  t.is(person.count, 2)
  t.is(person.hi(), 'my name is foo')
  t.is(person.count, 3)
  t.is(person.hi(), 'my name is foo')
  t.is(person.count, 4)
}

function clearCache(personName, t) {
  const person = t.context[personName]
  t.is(person.count, 4)
  person._cacheKey.name.cached = false
  t.is(person.name, 'foo')
  t.is(person.count, 5)
}

test.serial.before(t => {
  function Person() {
    this.count = 0
  }
  Person.prototype = Object.create(null, Object.getOwnPropertyDescriptors({
    get name() {
      this.count++
      return 'foo'
    },
    hi() {
      this.count++
      return `my name is ${this.name}`
    }
  }))
  t.context.person = new Person()
  getterCache(t.context.person, 'name', 'hi')

  const NewPerson = getterCache.class(Person)
  t.context.person1 = new NewPerson()
  t.context.person2 = new NewPerson()
})

test.serial('object: main', main.bind(null, 'person'))
test.serial('object: clear cache', clearCache.bind(null, 'person'))
test.serial('class: main (instance 1)', main.bind(null, 'person1'))
test.serial('class: clear cache (instance 1)', clearCache.bind(null, 'person1'))
test.serial('class: main (instance 2)', main.bind(null, 'person2'))
test.serial('class: clear cache (instance 2)', clearCache.bind(null, 'person2'))

# getter-cache

> Make object/class getter property cacheable.

## Usage

```js
// import
const createGetterCache = require('getter-cache')
// default random cache key (store cache info)
const getterCache = createGetterCache()
// specify cache key
const getterCache = createGetterCache({ cacheKey: '_CACHE_KEY' })
```
```js
// object (default all own getter properties)
getterCache(obj)

// class (default all own getter properties)
getterCache.class(cls)

// specify properties, even inherited ones.
getterCache(obj, 'foo', 'bar')
```

## Example

```js
const getterCache = require('getter-cache')()

const person = {
  get name() {
    console.log('get name')
    return 'foo'
  },
  // ignore non-getter property
  hi() {
    console.log(`my name is ${this.name}`)
  }
}

getterCache(person, 'name', 'hi')

person.hi()
// get name
// my name is foo
person.hi()
// my name is foo
```

## Customize cache property name

```js
const getterCache = require('getter-cache')({ cacheKey: '_GETTER_CACHE' })
```

## Clear cache

> if clear cache is required, it's better to provide `cacheKey` option for easy handle.

```js
// will call original getter function next time
obj._GETTER_CACHE.name.cached = false
```

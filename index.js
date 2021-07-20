module.exports = function(options) {
  options = options || { cacheKey: '_GETTER_CACHE_' + Math.random() }

  const cacheKey = options.cacheKey

  return function cacheGetter(obj) {

    for (const property of [].slice.call(arguments, 1)) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, property)

      if (descriptor.get) {
        obj[cacheKey] = obj[cacheKey] || {}
        obj[cacheKey][property] = { descriptor: descriptor }

        const getter = function() {
          const cache = this[cacheKey][property]
          if (!cache.cached) {
            cache.value = cache.descriptor.get.call(this)
            cache.cached = true
          }
          return cache.value
        }

        Object.defineProperty(obj, property, Object.assign({}, descriptor, { get: getter }))
      }
    }

    return obj
  }
}

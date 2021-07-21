module.exports = function(options) {
  options = options || { cacheKey: '_GETTER_CACHE_' + Math.random() }

  const CACHE_KEY = options.cacheKey

  cacheGetter.class = cacheClassGetter
  cacheGetter.getDescriptor = getDescriptor

  return cacheGetter

  /**
   * Make **getter** properties of `object` cacheable, even if inherited ones.
   *
   * ! only consider own properties if no properties specified.
   *
   * @template {Exclude<*, undefined|null>} T
   * @param {T} obj
   * @param {string[]} properties default are all own properties
   * @returns {T}
   */
  function cacheGetter(obj, ...properties) {
    if (obj == null) return obj

    if (!properties.length) {
      properties = Object.getOwnPropertyNames(obj)
    }

    const getters = {}

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      const descriptor = Array.isArray(property)
        ? properties.push(...property)
        : getDescriptor(obj, property, true)

      if (getters[property] = descriptor.get) {
        const getter = function() {
          this[CACHE_KEY] = this[CACHE_KEY] || {}
          const cache = this[CACHE_KEY][property] = this[CACHE_KEY][property] || {}
          if (!cache.cached) {
            cache.value = getters[property].call(this)
            cache.cached = true
          }
          return cache.value
        }

        Object.defineProperty(obj, property, { ...descriptor, get: getter })
      }
    }
    return obj
  }

  /**
   * Make **getter** properties of class cacheable, even if inherited ones.
   *
   * @template {function} T
   * @param {T} cls
   * @param {string[]} properties
   * @returns {T}
   */
  function cacheClassGetter(cls, ...properties) {
    cacheGetter(cls.prototype, ...properties)
    return cls
  }
}

/**
 * Get property descriptor, even inherited.
 *
 * @param {Exclude<*, undefined|null>} obj
 * @param {string} property
 * @param {boolean} [inherited=false]
 * @returns
 */
function getDescriptor(obj, property, inherited = false) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, property)
  if (inherited && !descriptor) return getDescriptor(Object.getPrototypeOf(obj), property, true)
  return descriptor
}

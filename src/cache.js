import { getGlobal, setGlobal } from './utils'

const __CACHE_NAME_SPACE__ = '__CACHE__'
const __GLOBAL_CACHE_NAME_SPACE__ = '__GLOBAL_MFE_CACHE__'

class Cache {
  /**
   * Constructs a Cache instance.
   *
   * If no context is provided, initializes an empty cache or uses the global
   * window cache if available. If a context is provided, it must be an instance
   * of Cache, and the cache is initialized with the provided context's cache.
   *
   * Binds class methods to ensure proper context when invoked.
   *
   * @param {Cache} [context] - An optional Cache instance to initialize the cache.
   * @throws {Error} If the provided context is not an instance of Cache.
   */
  constructor(context) {
    if (context && !context instanceof Cache)
      throw new Error(`InvalidCache: cache should be of type of Cache`)
    if (context) this.__CACHE__ = context.__CACHE__
    this.__CACHE__ = getGlobal(__GLOBAL_CACHE_NAME_SPACE__) || {}
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.delete = this.delete.bind(this)
    this.clear = this.clear.bind(this)
    this.keys = this.keys.bind(this)
    this.values = this.values.bind(this)
    this.getCache = this.getCache.bind(this)
    this.isEmpty = this.isEmpty.bind(this)
    this.toString = this.toString.bind(this)
    this.sync = this.sync.bind(this)
  }
  /**
   * Get the value associated with the given key.
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    return new Promise((resolve) => {
      resolve(this.__CACHE__[key])
    })
  }
  /**
   * Sets the value associated with the given key in the cache.
   * Throws an error if the key is empty.
   *
   * @param {string} key - The key to set in the cache.
   * @param {any} value - The value to associate with the key.
   */
  set(key, value) {
    if (!key) {
      throw new Error('Cache: key should not be empty')
    }
    if (!value) {
      throw new Error('Cache: value should not be empty')
    }
    console.info('Cache::set', key, value)
    this.__CACHE__[key] = value
    this.sync()
  }
  /**
   * Syncs the cache to the window's __MFE_CACHE__ property.
   * This is useful for debugging purposes as it allows you to inspect the cache in the browser's console.
   */
  sync() {
    setGlobal(__GLOBAL_CACHE_NAME_SPACE__, this.__CACHE__)
  }
  /**
   * Removes the value associated with the given key from the cache.
   * Throws an error if the key is empty.
   * @param {string} key - The key to remove from the cache.
   */
  delete(key) {
    if (!key) {
      throw new Error('Cache: key should not be empty')
    }
    delete this.__CACHE__[key]
    this.sync()
  }
  /**
   * Clear the cache.
   */
  clear() {
    this.__CACHE__ = {}
    this.sync()
  }
  /**
   * Get an array of keys in the cache.
   * @returns {Array<string>}
   */
  keys() {
    return Object.keys(this.__CACHE__)
  }
  /**
   * Get an array of values in the cache.
   * @returns {Array<any>} An array containing all values stored in the cache.
   */
  values() {
    return Object.values(this.__CACHE__)
  }
  /**
   * Get the underlying cache object.
   * @returns {Object<string, any>} The underlying cache object.
   * @private
   */
  getCache() {
    return new Promise((resolve) => {
      resolve(this.__CACHE__)
    })
  }
  /**
   * Check if the cache is empty.
   * @returns {boolean} True if the cache is empty, false otherwise.
   */
  isEmpty() {
    return Object.keys(this.__CACHE__).length === 0
  }

  toString() {
    return JSON.stringify(this.__CACHE__)
  }
}

export default Cache

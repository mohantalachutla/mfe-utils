class Cache {
  constructor() {
    this.__CACHE__ = {}
  }
  /**
   * Get the value associated with the given key.
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    return this.__CACHE__[key]
  }
  /**
   * Synchronizes the in-memory cache with the local storage.
   * This method saves the current state of the cache to the local storage
   * under the specified cache key, allowing for persistence across sessions.
   */
  sync() {}
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
    this.__CACHE__[key] = value
    this.sync()
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
   * Check if the given key exists in the cache.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return key in this.__CACHE__
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
   * Returns the entire cache object.
   * @returns {Object<string, any>}
   */
  getCache() {
    return this.__CACHE__
  }
  /**
   * Check if the cache is empty.
   * @returns {boolean} True if the cache is empty, false otherwise.
   */
  isEmpty() {
    return Object.keys(this.__CACHE__).length === 0
  }
}

export default Cache

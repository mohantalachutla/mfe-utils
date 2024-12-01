export const isEmpty = (value) => {
  if (value === undefined || value === null || value === '') {
    return true
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  return false
}

export const isFunction = (value) => {
  return typeof value === 'function'
}

export const isString = (value) => {
  return typeof value === 'string'
}

export const isNumber = (value) => {
  return typeof value === 'number'
}

export const isObject = (value) => {
  return typeof value === 'object'
}

export const isArray = (value) => {
  return Array.isArray(value)
}

export const setGlobal = (key, value) => {
  if (global) {
    global[key] = value
  } else if (window) {
    window[key] = value
  }
}

export const getGlobal = (key) => {
  if (global) {
    return global[key]
  } else if (window) {
    return window[key]
  }
}

import { isEmpty, isObject, isString } from '../utils'

/**
 * Validate that the given mfeName is a valid Module Federation name.
 * which tests against the following regex: \[^a-zA-Z0-9_]/g\
 * @function validateMfeName
 * @param {string} mfeName - The name of the module federation.
 * @throws {Error} If the mfeName is invalid.
 * @returns {void}
 */
export const validateMfeName = function (mfeName) {
  if (isEmpty(mfeName)) {
    throw new Error(`InvalidMfeName: mfe name should not be empty`)
  }
  if (!isString(mfeName)) {
    throw new Error(`InvalidMfeName: mfe name should be a string`)
  }
  const reg = new RegExp('[^a-zA-Z0-9_]', 'g')
  if (reg.test(mfeName)) {
    throw new Error(
      `InvalidMfeName: mfe name ${mfeName} should not contain special characters`
    )
  }
  return true
}
export const isValidMfeName = function (mfeName) {
  try {
    validateMfeName(mfeName)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Validates the provided remotes configuration and returns it if valid.
 * Throws an error if the remotes are invalid or empty.
 *
 * If the remotes is a string, it checks if the string is valid as a remote URL and returns it as an object with the MFE name as the key.
 * If the remotes is an object, it checks each key is a valid MFE name
 * and each value is a valid remote URL.
 *
 * If the remotes is an array, it checks each remote URL is valid and
 * splits it into an object with the MFE name as the key.
 *
 * @param {Object|Array|string} remotes - The remotes configuration to validate.
 * @throws {Error} If no remotes are provided or if any remote name or URL is invalid.
 * @returns {Object} The validated remotes configuration.
 */
export const validateAndGetRemotes = (remotes) => {
  const getRemoteFromUrl = (url) => {
    if (!isValidRemoteUrl(url)) {
      throw new Error(`Invalid remote url: ${url}`)
    }
    const parts = url.split('@')
    return {
      [parts[0]]: url,
    }
  }
  if (isEmpty(remotes)) {
    throw new Error('No remotes provided')
  }
  if (isString(remotes)) {
    return getRemoteFromUrl(remotes)
  } else if (isObject(remotes)) {
    Object.entries(remotes).forEach(([key, value]) => {
      if (!isValidMfeName(key)) {
        throw new Error(`Invalid remote name: ${key}`)
      }
      if (!isValidRemoteUrl(value)) {
        throw new Error(`Invalid remote url: ${value}`)
      }
    })
  } else if (isArray(remotes)) {
    return (remotes = []).map((remote) => {
      return getRemoteFromUrl(remote)
    })
  } else {
    throw new Error(`Invalid remotes: ${remotes}`)
  }
  return remotes
}

/**
 * @function isValidRemoteUrl
 * Checks if a url is valid for module federation.
 * The url should be in the format of <mfe_name>@<remote_url>
 * The mfe_name should be a valid mfe name.
 * The remote_url should be a valid url that starts with http or https and end with .js
 * @param {string} url the url to check
 * @returns {boolean} true if the url is valid, false otherwise
 */
export const isValidRemoteUrl = (url) => {
  if (!isString(url) || isEmpty(url)) {
    return false
  }
  let parts = url.split('@')
  if (parts.length !== 2) {
    return false
  }
  if (!isValidMfeName(parts[0])) {
    return false
  }
  if (
    !(parts[1].startsWith('http://') || parts[1].startsWith('https://')) &&
    parts[1].endsWith('.js')
  ) {
    return false
  }
  return true
}

export const validateAndGetSharedDeps = (sharedDeps) => {
  if (isEmpty(sharedDeps)) {
    throw new Error('No shared dependencies provided')
  }
  if (!isObject(sharedDeps)) {
    throw new Error(`Invalid shared dependencies: ${sharedDeps}`)
  }
  Object.entries(sharedDeps).forEach(([key, value]) => {
    if (isEmpty(key) || !isString(key)) {
      throw new Error(`Invalid shared dependency name: ${key}`)
    }
    if (isEmpty(value) || !(isString(value) || isObject(value))) {
      throw new Error(`Invalid shared dependency version: ${value}`)
    }
  })
  return sharedDeps
}

export const validateAndGetFile = (fileName) => {
  if (isEmpty(fileName)) {
    throw new Error('File or Directory name should not be empty')
  }
  if (!isString(fileName)) {
    throw new Error(`File or Directory name must be a string. Got ${fileName}`)
  }
  if (!fileName.startsWith('./') && !fileName.startsWith('../')) {
    fileName = `./${fileName}`
  }
  return fileName
}

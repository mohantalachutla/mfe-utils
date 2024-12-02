/* eslint-disable no-undef */
import { isEmpty } from '../utils'
import { validateMfeName, validateAndGetFile } from './validators'
import Cache from '../cache'

const getDefaultModule = (Component = () => {}) => ({
  __esModule: true,
  default: Component,
})

const cache = new Cache()

export const loadMfe = async ({
  url,
  name,
  moduleName = './App',
  defaultComponent = () => {},
  enableCache = true,
}) => {
  validateRequiredInputs(url, name)
  console.info(`loading module ${moduleName} of mfe ${name} from ${url}`)
  try {
    console.info(`current cache ${cache.toString()}`)
    return await loadModule({ url, name, moduleName, enableCache })
  } catch (error) {
    console.error(error)
    return getDefaultModule(defaultComponent)
  }
}

const getCacheKey = (name, moduleName) =>
  name + '-' + moduleName?.replace('/', '').replace('.', '')

const validateRequiredInputs = (url, name) => {
  if (isEmpty(url)) {
    throw new Error(`InvalidUrl: mfe remote url should not be empty`)
  }
  if (isEmpty(name)) {
    throw new Error(`InvalidMfeName: mfe name should not be empty`)
  }
  validateMfeName(name)

  if (!window) {
    throw new Error(`InvalidWindow: browser window should not be empty`)
  }
  if (!window.document) {
    throw new Error(`InvalidDocument: window.document should not be empty`)
  }
  if (!__webpack_init_sharing__) {
    throw new Error(
      `InvalidInitSharing: __webpack_init_sharing__ should not be empty`
    )
  }
  // eslint-disable-next-line no-undef
  if (!__webpack_share_scopes__?.default) {
    throw new Error(
      `InvalidShareScopes: __webpack_share_scopes__ should not be empty`
    )
  }
}

/**
 * Loads a script from the given url. The url is appended with the
 * filename if provided.
 * @param {string} url The url to load the script from.
 * @param {string} [filename='remoteEntry.js'] The filename to append to the url.
 * @returns {Promise<void>} A promise that resolves when the script is loaded.
 * @throws {Error} If the script fails to load.
 */
export const loadScript = async (url, filename = 'remoteEntry.js') => {
  const fullUrl = `${url}/${filename}`
  try {
    //Loading the remote url
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = fullUrl
      // script.async = true;
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })
    console.info(`loadScript: script loaded from ${fullUrl}`)
  } catch (error) {
    console.error(`error loading script: ${fullUrl}`)
    throw error
  }
}

/**
 * @function loadModule
 * Loads a module from a container.
 * @param {ModuleFederationContainer} container The module federation container.
 * @param {string} [module='./App'] The name or relative path of the module to import.
 * @returns {Promise<Module>} A promise that resolves when the component is loaded.
 */
const loadModule = async ({ url, name, moduleName, enableCache = true }) => {
  const __CACHE_KEY__ = getCacheKey(name, moduleName)
  let Module
  // fetching from cache
  if (enableCache && cache) Module = cache.get(__CACHE_KEY__)
  if (Module) {
    return Module
  }
  console.info(
    `loading module ${moduleName} from ${url} ${
      enableCache ? 'and caching with key ' + __CACHE_KEY__ : ''
    }`
  )
  await loadScript(url)
  let moduleFactory
  // loading the container and module factory
  try {
    //Container creation
    // const init = await __webpack_init_sharing__('default') // Not working with it
    if (!window[name]) {
      console.error(`Failed to load container ${name}`)
      throw new Error(`Failed to load container ${name}`)
    }
    // Initialize the container, it may provide shared modules
    // eslint-disable-next-line no-undef
    await window[name].init(__webpack_share_scopes__.default)
    moduleFactory = await window[name].get(
      validateAndGetFile(moduleName || './App')
    )
    if (!moduleFactory) {
      console.error(`Failed to load module factory`)
      throw new Error(`Failed to load module factory`)
    }
  } catch (error) {
    console.error('error loading container')
    throw error
  }

  // loading the module from module factory
  try {
    Module = moduleFactory && moduleFactory()
    if (!Module) {
      console.error(`Failed to load module ${moduleName}`)
      throw new Error(`Failed to load module ${moduleName}`)
    }

    if (enableCache && cache) cache.set(__CACHE_KEY__, Module) // Add to cache

    return Module
  } catch (error) {
    console.error('Error loading module')
    throw error
  }
}

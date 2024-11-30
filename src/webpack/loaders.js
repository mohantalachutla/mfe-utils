/* eslint-disable no-undef */
import { isEmpty } from '../utils'
import { validateMfeName, validateAndGetFile } from './validators'
import Cache from '../cache'

/**
 * Loads a MicroFrontend (MFE) module by URL and name, optionally caching the result.
 *
 * @param {string} url - The URL of the remote module federation entry.
 * @param {string} name - The name of the module federation to load.
 * @param {string} moduleName - The specific module within the federation to load. The name or relative path of the module to import.
 *
 * This function first validates the inputs and ensures the necessary window and document objects are present.
 * It checks if the specified MFE is already cached, and if so, returns the cached module.
 * Otherwise, it loads the remote container and caches it before returning the specified module.
 *
 * @throws {Error} If any of the input parameters are invalid or if the loading process fails.
 * @returns {Promise<Module>} A promise that resolves to the loaded module.
 */
export const loadMfe = async (url, name, moduleName) => {
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
  // eslint-disable-next-line no-undef
  if (!__webpack_share_scopes__?.default) {
    throw new Error(
      `InvalidShareScopes: __webpack_share_scopes__ should not be empty`
    )
  }
  const __FULL_REMOTE__ = `${name}@${url}/remoteEntry.js`
  const cache = new Cache()
  try {
    if (cache.has(__FULL_REMOTE__)) {
      return loadModule(cache.get(__FULL_REMOTE__))(moduleName) // Return from cache
    }
    const container = await loadContainer(url, name) // Load the container
    cache.set(__FULL_REMOTE__, container) // Add to cache
    return loadModule(container)(moduleName)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Loads a remote module federation container by injecting a script tag into the document.
 *
 * @param {string} url - The base URL of the remote module federation.
 * @param {string} name - The name of the module federation container to load.
 *
 * The function dynamically creates a script tag to load the remote module federation entry
 * and attaches it to the document body. Once the script is loaded, it initializes the container
 * with the shared scopes and returns the container. The function also logs the loading process
 * and throws an error if the container fails to load.
 *
 * @returns {Promise<object>} A promise that resolves to the loaded module federation container.
 * @throws {Error} If the container fails to load or initialize.
 */
export const loadContainer = async (url, name) => {
  try {
    //Container creation
    //Loading the remote url
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `${url}/remoteEntry.js`
      // script.async = true;
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })
    // const init = await __webpack_init_sharing__("default");
    // console.debug({
    //   // init,
    //   wis: __webpack_init_sharing__,
    //   wss: __webpack_share_scopes__,
    //   wr: __webpack_require__,
    // })
    console.info(`Loaded script at ${name}@${url}/remoteEntry.js`)
    const container = window[name]
    if (!container) {
      throw new Error(`Failed to load container ${url}::${name}`)
    }
    // Initialize the container, it may provide shared modules
    // eslint-disable-next-line no-undef
    await container.init(__webpack_share_scopes__.default)
    return container
  } catch (error) {
    console.error('Error loading container')
    console.error(error)
  }
}

/**
 * @function loadModule
 * Loads a module from a container.
 * @param {ModuleFederationContainer} container The module federation container.
 * @param {string} [module='./App'] The name or relative path of the module to import.
 * @returns {Promise<Module>} A promise that resolves when the component is loaded.
 */
export const loadModule = (container) => async (module) => {
  try {
    const factory = await container.get(validateAndGetFile(module || './App'))
    const Module = factory()
    if (!Module) {
      throw new Error(`Failed to load module ${module}`)
    }
    return Module
  } catch (error) {
    console.error('Error loading module')
    console.error(error)
  }
}

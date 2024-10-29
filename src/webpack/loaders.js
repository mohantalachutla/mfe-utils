/* eslint-disable no-undef */
import { isEmpty } from '../utils'
import { validateMfeName, validateAndGetFile } from './validators'
/**
 * @function loadMfe
 * Loads a module federation component.
 * @param {string} url The remote url of the module federation.
 * @param {string} name The name of the module federation.
 * @param {string} module The name or relative path of the module to import.
 * @returns {Promise<Module>} A promise that resolves when the component is loaded.
 */
export const loadMfe = async (url, name, module) => {
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
  const fullRemote = `${name}@${url}/remoteEntry.js`
  console.info(`Loading mfe at ${fullRemote}`)
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
    console.debug({
      // init,
      wis: __webpack_init_sharing__,
      wss: __webpack_share_scopes__,
      wr: __webpack_require__,
    })
    console.info(`Loaded mfe at ${name}@${url}/remoteEntry.js`)
    const container = window[name]
    if (!container) {
      throw new Error(`Failed to load mfe ${url}::${name}`)
    }
    // Initialize the container, it may provide shared modules
    // eslint-disable-next-line no-undef
    await container.init(__webpack_share_scopes__.default)
    const factory = await window[name].get(validateAndGetFile(module))
    const Module = factory()
    console.debug({ Module })
    if (!Module) {
      throw new Error(`Failed to load module ${module}`)
    }
    return Module
  } catch (error) {
    throw new Error(`Failed to load mfe ${url}`)
  }
}

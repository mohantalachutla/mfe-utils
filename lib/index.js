import { EventEmitter } from 'events';
import _ from 'lodash';

const emitter = new EventEmitter();

const sendEvent = (event, data) => {
  if (_.isEmpty(event)) {
    throw new Error(`InvalidEvent: event should not be empty`)
  }

  if (_.isEmpty(data)) {
    throw new Error(`InvalidData: data should not be empty`)
  }
  emitter.emit(event, data);
};

const subscribeEvent = (event, cb) => {
  if (_.isEmpty(event)) {
    throw new Error(`InvalidEvent: event should not be empty`)
  }

  if (_.isEmpty(cb)) {
    throw new Error(`InvalidCallback: callback should not be empty`)
  }
  emitter.on(event, cb);
};

var events = /*#__PURE__*/Object.freeze({
  __proto__: null,
  sendEvent: sendEvent,
  subscribeEvent: subscribeEvent
});

/**
 * Validate that the given mfeName is a valid Module Federation name.
 * which tests against the following regex: \[^a-zA-Z0-9_]/g\
 * @function validateMfeName
 * @param {string} mfeName - The name of the module federation.
 * @throws {Error} If the mfeName is invalid.
 * @returns {void}
 */
const validateMfeName = function (mfeName) {
  if (!mfeName) {
    throw new Error(`InvalidMfeName: mfe name should not be empty`)
  }
  if (typeof mfeName !== 'string') {
    throw new Error(`InvalidMfeName: mfe name should be a string`)
  }
  const reg = new RegExp('[^a-zA-Z0-9_]', 'g');
  if (reg.test(mfeName)) {
    throw new Error(
      `InvalidMfeName: mfe name ${mfeName} should not contain special characters`
    )
  }
};

var validate = /*#__PURE__*/Object.freeze({
  __proto__: null,
  validateMfeName: validateMfeName
});

/* eslint-disable no-undef */
/**
 * @function loadMfe
 * Loads a module federation component.
 * @param {string} url The remote url of the module federation.
 * @param {string} mfe The name of the module federation.
 * @param {string} moduleName The name of the module to import.
 * @returns {Promise<Module>} A promise that resolves when the component is loaded.
 */
const loadMfe = async (url, mfe, moduleName) => {
  if (!url) {
    throw new Error(`InvalidUrl: mfe remote url should not be empty`)
  }
  if (!module) {
    throw new Error(`InvalidMfeName: mfe name should not be empty`)
  }
  validateMfeName(mfe);

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

  try {
    //Container creation
    //Loading the remote url
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${url}/remoteEntry.js`;
      // script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
    // const init = await __webpack_init_sharing__("default");
    console.debug({
      // init,
      wis: __webpack_init_sharing__,
      wss: __webpack_share_scopes__,
      wr: __webpack_require__,
    });
    const container = window[mfe];

    if (!container) {
      throw new Error(`Failed to load mfe ${url}::${mfe}`)
    }
    // Initialize the container, it may provide shared modules
    // eslint-disable-next-line no-undef
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[mfe].get(moduleName);
    const Module = factory();
    console.debug({ Module });
    if (!Module) {
      throw new Error(`Failed to load module ${moduleName}`)
    }
    return Module
  } catch (error) {
    throw new Error(`Failed to load mfe ${url}`)
  }
};

var load = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadMfe: loadMfe
});

const utils = { ...events, ...validate, ...load };

export { utils as default };

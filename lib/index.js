import { EventEmitter } from 'events';

const isEmpty = (value) => {
  if (value === undefined || value === null || value === '') {
    return true
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  return false
};

const isFunction = (value) => {
  return typeof value === 'function'
};

const isString = (value) => {
  return typeof value === 'string'
};

const isObject = (value) => {
  return typeof value === 'object'
};

const emitter = new EventEmitter();

const sendEvent = (event, data) => {
  if (isEmpty(event)) {
    throw new Error(`InvalidEvent: event should not be empty`)
  }

  if (isEmpty(data)) {
    throw new Error(`InvalidData: data should not be empty`)
  }
  emitter.emit(event, data);
};

const subscribeEvent = (event, cb) => {
  if (isEmpty(event)) {
    throw new Error(`InvalidEvent: event should not be empty`)
  }

  if (isEmpty(cb) || !isFunction(cb)) {
    throw new Error(`InvalidCallback: callback is empty or not a function`)
  }
  emitter.on(event, cb);
};

var events = { sendEvent, subscribeEvent, emitter };

var events$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: events,
  sendEvent: sendEvent,
  subscribeEvent: subscribeEvent
});

const MFE_EVENT_SEND = 'MFE_EVENT_SEND';
const MFE_EVENT_SUBSCRIBE = 'MFE_EVENT_SUBSCRIBE';
const MFE_LOAD = 'MFE_LOAD';
const MFE_UNLOAD = 'MFE_UNLOAD';
const MFE_GATEWAY_LOAD = 'MFE_GATEWAY_LOAD';
const MFE_GATEWAY_UNLOAD = 'MFE_GATEWAY_UNLOAD';
const MFE_REGISTER = 'MFE_REGISTER';
const MFE_UNREGISTER = 'MFE_UNREGISTER';

var constants = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MFE_EVENT_SEND: MFE_EVENT_SEND,
  MFE_EVENT_SUBSCRIBE: MFE_EVENT_SUBSCRIBE,
  MFE_GATEWAY_LOAD: MFE_GATEWAY_LOAD,
  MFE_GATEWAY_UNLOAD: MFE_GATEWAY_UNLOAD,
  MFE_LOAD: MFE_LOAD,
  MFE_REGISTER: MFE_REGISTER,
  MFE_UNLOAD: MFE_UNLOAD,
  MFE_UNREGISTER: MFE_UNREGISTER
});

/**
 * Validate that the given mfeName is a valid Module Federation name.
 * which tests against the following regex: \[^a-zA-Z0-9_]/g\
 * @function validateMfeName
 * @param {string} mfeName - The name of the module federation.
 * @throws {Error} If the mfeName is invalid.
 * @returns {void}
 */
const isValidMfeName$1 = function (mfeName) {
  if (isEmpty(mfeName)) {
    throw new Error(`InvalidMfeName: mfe name should not be empty`)
  }
  if (!isString(mfeName)) {
    throw new Error(`InvalidMfeName: mfe name should be a string`)
  }
  const reg = new RegExp('[^a-zA-Z0-9_]', 'g');
  if (reg.test(mfeName)) {
    throw new Error(
      `InvalidMfeName: mfe name ${mfeName} should not contain special characters`
    )
  }
  return true
};

/**
 * Validates the provided remotes configuration and returns it if valid.
 * Throws an error if the remotes are invalid or empty.
 *
 * If the remotes is an object, it checks each key is a valid MFE name
 * and each value is a valid remote URL.
 *
 * If the remotes is an array, it checks each remote URL is valid and
 * splits it into an object with the MFE name as the key.
 *
 * @param {Object|Array} remotes - The remotes configuration to validate.
 * @throws {Error} If no remotes are provided or if any remote name or URL is invalid.
 * @returns {Object} The validated remotes configuration.
 */
const validateAndGetRemotes = (remotes) => {
  if (isEmpty(remotes)) {
    throw new Error('No remotes provided')
  }
  if (isObject(remotes)) {
    Object.keys(remotes).forEach((key) => {
      if (!isValidMfeName$1(key)) ;
    });
    Object.values(remotes).forEach((value) => {
      if (!isValidRemoteUrl(value)) {
        throw new Error(`Invalid remote url: ${value}`)
      }
    });
  } else if (isArray(remotes)) {
(remotes = []).map((remote) => {
      if (!isValidRemoteUrl(remote)) {
        throw new Error(`Invalid remote url: ${remote}`)
      }
      const parts = remote.split('@');
      return {
        [parts[0]]: remote,
      }
    });
  } else {
    throw new Error(`Invalid remotes: ${remotes}`)
  }
  return remotes
};
/**
 * @function isValidRemoteUrl
 * Checks if a url is valid for module federation.
 * The url should be in the format of <mfe_name>@<remote_url>
 * The mfe_name should be a valid mfe name.
 * The remote_url should be a valid url that starts with http or https and end with .js
 * @param {string} url the url to check
 * @returns {boolean} true if the url is valid, false otherwise
 */
const isValidRemoteUrl = (url) => {
  if (!isString(url) || isEmpty(url)) {
    return false
  }
  let parts = url.split('@');
  if (parts.length !== 2) {
    return false
  }
  if (!isValidMfeName$1(parts[0])) ;
  if (
    !(parts[1].startsWith('http://') || parts[1].startsWith('https://')) &&
    parts[1].endsWith('.js')
  ) {
    return false
  }
  return true
};

const validateAndGetSharedDeps = (sharedDeps) => {
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
  });
  return sharedDeps
};

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
  if (isEmpty(url)) {
    throw new Error(`InvalidUrl: mfe remote url should not be empty`)
  }
  if (isEmpty) {
    throw new Error(`InvalidMfeName: mfe name should not be empty`)
  }
  isValidMfeName$1(mfe);

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

var loaders = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadMfe: loadMfe
});

/**
 * Returns a configured Webpack ModuleFederationPlugin instance.
 *
 * @param {function} Pluginn - The ModuleFederationPlugin constructor.
 * @param {string} name - The name of the module federation.
 * @param {Record<string, string>} remotes - A map of module names to remote URLs.
 * @param {Record<string, string>} sharedDeps - A map of shared dependency names to versions.
 *
 * The plugin will be configured with the given name, remotes, and shared dependencies.
 *
 * @returns {ModuleFederationPlugin} A configured Webpack ModuleFederationPlugin instance.
 */
const configureMFRemotePlugin =
  (Pluginn) => (name, remotes, sharedDeps) => {
    if (!Pluginn) throw new Error('Pluginn is required')
    return new Pluginn({
      name,
      remotes: validateAndGetRemotes(remotes),
      shared: validateAndGetSharedDeps(sharedDeps),
    })
  };

/**
 * Returns a configured Webpack ModuleFederationPlugin instance.
 *
 * @param {function} Pluginn - The ModuleFederationPlugin constructor.
 * @param {string} name - The name of the module federation.
 * @param {string} [filename='remoteEntry.js'] - The filename of the remote entry.
 * @param {Record<string, string>} [exposes={}] - A map of exposed module names to paths.
 * @param {Record<string, string>} [sharedDeps={}] - A map of shared dependency names to versions.
 *
 * The plugin will be configured with the given name, filename, exposes, and shared dependencies.
 * <br>
 * The default filename is 'remoteEntry.js'.
 * And It exposes './App' from './src/App' by default.
 *
 * @returns {ModuleFederationPlugin} A configured Webpack ModuleFederationPlugin instance.
 */
const configureMFPlugin =
  (Pluginn) =>
  (name, filename = 'remoteEntry.js', exposes = {}, sharedDeps) => {
    if (!Pluginn) throw new Error('Pluginn is required')
    return new Pluginn({
      name,
      filename: filename,
      library: { type: 'var', name },
      exposes: {
        './App': './src/App',
        ...exposes,
      },
      shared: validateAndGetSharedDeps(sharedDeps),
    })
  };

/**
 * Returns a Webpack ModuleFederationPlugin instance with React-specific shared dependencies.
 *
 * @param {string} name - The name of the module federation.
 * @param {Record<string, string>} remotes - A map of module names to remote URLs.
 * @param {Record<string, string>} sharedDeps - A map of shared dependency names to versions.
 *
 * This function utilizes the getMFPlugin function to configure the module federation with the
 * provided name, remotes, and shared dependencies. Additionally, it explicitly sets the react
 * and react-dom dependencies as shared with singleton=true, using the version specified in
 * the package.json or defaulting to 'latest' if not specified.
 *
 * @returns {ModuleFederationPlugin} A Webpack ModuleFederationPlugin instance configured for React.
 */
const configureMFRemoteReactPlugin =
  (Pluginn) => (name, remotes, sharedDeps) => {
    return configureMFRemotePlugin(Pluginn)(name, remotes, {
      ...sharedDeps,
      ...getReactSharedDeps(sharedDeps),
    })
  };

/**
 * Returns a Webpack ModuleFederationPlugin instance configured for React.
 *
 * @param {function} Pluginn - The ModuleFederationPlugin constructor.
 * @param {string} name - The name of the module federation.
 * @param {string} filename - The filename of the remote entry.
 * @param {Record<string, string>} exposes - A map of exposed module names to paths.
 * @param {Record<string, string>} sharedDeps - A map of shared dependency names to versions.
 *
 * This function uses the configureMFRemotePlugin to set up the module federation with
 * the specified name, filename, exposes, and shared dependencies. It ensures that
 * 'react' and 'react-dom' are shared with singleton=true, using the specified version
 * or defaulting to 'latest' if not specified.
 *
 * @returns {ModuleFederationPlugin} A Webpack ModuleFederationPlugin instance configured for React.
 */
const configureMFReactPlugin =
  (Pluginn) => (name, filename, exposes, sharedDeps) => {
    return configureMFPlugin(Pluginn)(name, filename, exposes, {
      ...sharedDeps,
      ...getReactSharedDeps(sharedDeps),
    })
  };

/**
 * Returns a Webpack ModuleFederationPlugin instance with Svelte-specific shared dependencies.
 *
 * @param {string} name - The name of the module federation.
 * @param {Record<string, string>} remotes - A map of module names to remote URLs.
 * @param {Record<string, string>} sharedDeps - A map of shared dependency names to versions.
 *
 * This function utilizes the getMFPlugin function to configure the module federation with the
 * provided name, remotes, and shared dependencies. Additionally, it explicitly sets the svelte
 * dependency as shared with singleton=true, using the version specified in the package.json or
 * defaulting to 'latest' if not specified.
 *
 * @returns {ModuleFederationPlugin} A Webpack ModuleFederationPlugin instance configured for Svelte.
 */
const configureMFRemoteSveltePlugin =
  (Pluginn) => (name, remotes, sharedDeps) => {
    return configureMFRemotePlugin(Pluginn)(name, remotes, {
      ...sharedDeps,
      ...getSvelteSharedDeps(sharedDeps),
    })
  };

/**
 * Returns a Webpack ModuleFederationPlugin instance with Svelte-specific shared dependencies.
 *
 * @param {string} name - The name of the module federation.
 * @param {string} filename - The filename of the remote entry.
 * @param {Record<string, string>} exposes - A map of exposed module names to paths.
 * @param {Record<string, string>} sharedDeps - A map of shared dependency names to versions.
 *
 * This function uses the configureMFPlugin to set up the module federation with
 * the specified name, filename, exposes, and shared dependencies. It ensures that
 * 'svelte' is shared with singleton=true, using the specified version or defaulting
 * to 'latest' if not specified.
 *
 * @returns {ModuleFederationPlugin} A Webpack ModuleFederationPlugin instance configured for Svelte.
 */
const configureMFSveltePlugin =
  (Pluginn) => (name, filename, exposes, sharedDeps) => {
    return configureMFPlugin(Pluginn)(name, filename, exposes, {
      ...sharedDeps,
      ...getSvelteSharedDeps(sharedDeps),
    })
  };

const getSvelteSharedDeps = (sharedDeps) => ({
  svelte: {
    singleton: true,
    requiredVersion: sharedDeps.svelte ?? 'latest',
  },
});
const getReactSharedDeps = (sharedDeps) => ({
  react: {
    singleton: true,
    requiredVersion: sharedDeps.react ?? 'latest',
  },
  'react-dom': {
    singleton: true,
    requiredVersion: sharedDeps['react-dom'] ?? 'latest',
  },
});
const isValidMfeName = isValidMfeName$1;

var plugins = /*#__PURE__*/Object.freeze({
  __proto__: null,
  configureMFPlugin: configureMFPlugin,
  configureMFReactPlugin: configureMFReactPlugin,
  configureMFRemotePlugin: configureMFRemotePlugin,
  configureMFRemoteReactPlugin: configureMFRemoteReactPlugin,
  configureMFRemoteSveltePlugin: configureMFRemoteSveltePlugin,
  configureMFSveltePlugin: configureMFSveltePlugin,
  isValidMfeName: isValidMfeName
});

var index$1 = { ...loaders, ...plugins };

var webpack = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index$1
});

var index = { ...events$1, ...constants, ...webpack };

export { index as default };

import { validateAndGetRemotes, validateAndGetSharedDeps } from './validators'

const __REMOTE_FILENAME__ = 'remoteEntry.js'
const __DEFAULT_EXPOSES__ = {
  './App': './src/App',
}

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
export const configureMFRemotePlugin =
  (Pluginn) => (name, remotes, sharedDeps) => {
    if (!Pluginn) throw new Error('Pluginn is required')
    return new Pluginn({
      name,
      remotes: validateAndGetRemotes(remotes),
      shared: validateAndGetSharedDeps(sharedDeps),
    })
  }

/**
 * Returns a configured Webpack ModuleFederationPlugin instance.
 *
 * @param {function} Pluginn - The ModuleFederationPlugin constructor.
 * @param {string} name - The name of the module federation.
 * @param {Record<string, string>} [exposes={}] - A map of exposed module names to paths.
 * @param {Record<string, string>} [sharedDeps={}] - A map of shared dependency names to versions.
 * @param {string} [filename] - The filename of the remote entry.
 *
 * The plugin will be configured with the given name, filename, exposes, and shared dependencies.
 * <br>
 * The default filename is 'remoteEntry.js'.
 * And It exposes './App' from './src/App' by default.
 *
 * @returns {ModuleFederationPlugin} A configured Webpack ModuleFederationPlugin instance.
 */
export const configureMFPlugin =
  (Pluginn) =>
  (name, exposes = {}, sharedDeps, filename) => {
    if (!Pluginn) throw new Error('Pluginn is required')
    return new Pluginn({
      name,
      filename: filename ?? __REMOTE_FILENAME__,
      library: { type: 'var', name },
      exposes: {
        ...__DEFAULT_EXPOSES__,
        ...exposes,
      },
      shared: validateAndGetSharedDeps(sharedDeps),
    })
  }

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
export const configureMFRemoteReactPlugin =
  (Pluginn) => (name, remotes, sharedDeps) => {
    return configureMFRemotePlugin(Pluginn)(name, remotes, {
      ...sharedDeps,
      ...getReactSharedDeps(sharedDeps),
    })
  }

/**
 * Returns a configured Webpack ModuleFederationPlugin instance for React.
 *
 * @param {function} Pluginn - The ModuleFederationPlugin constructor.
 * @param {string} name - The name of the module federation.
 * @param {Record<string, string>} [exposes={}] - A map of exposed module names to paths.
 * @param {Record<string, string>} [sharedDeps={}] - A map of shared dependency names to versions.
 *
 * The plugin will be configured with the given name, exposes, and shared dependencies.
 * <br>
 * The default filename is 'remoteEntry.js'.
 * And It exposes './App' from './src/App' by default.
 * And it sets the react and react-dom dependencies as shared with singleton=true, using the version specified in
 * the package.json or defaulting to 'latest' if not specified.
 *
 * @returns {ModuleFederationPlugin} A configured Webpack ModuleFederationPlugin instance for React.
 */
export const configureMFReactPlugin =
  (Pluginn) => (name, exposes, sharedDeps) => {
    return configureMFPlugin(Pluginn)(name, exposes, {
      ...sharedDeps,
      ...getReactSharedDeps(sharedDeps),
    })
  }

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
export const configureMFRemoteSveltePlugin =
  (Pluginn) => (name, remotes, sharedDeps) => {
    return configureMFRemotePlugin(Pluginn)(name, remotes, {
      ...sharedDeps,
      ...getSvelteSharedDeps(sharedDeps),
    })
  }

/**
 * Returns a Webpack ModuleFederationPlugin instance with Svelte-specific shared dependencies.
 *
 * @param {function} Pluginn - The ModuleFederationPlugin constructor.
 * @param {string} name - The name of the module federation.
 * @param {Record<string, string>} [exposes={}] - A map of exposed module names to paths.
 * @param {Record<string, string>} [sharedDeps={}] - A map of shared dependency names to versions.
 *
 * The plugin will be configured with the given name, exposes, and shared dependencies.
 * <br>
 * The default filename is 'remoteEntry.js'.
 * And It exposes './App' from './src/App' by default.
 * And it sets the svelte dependency as shared with singleton=true, using the version specified in
 * the package.json or defaulting to 'latest' if not specified.
 *
 * @returns {ModuleFederationPlugin} A configured Webpack ModuleFederationPlugin instance for Svelte.
 */
export const configureMFSveltePlugin =
  (Pluginn) => (name, exposes, sharedDeps) => {
    return configureMFPlugin(Pluginn)(name, exposes, {
      ...sharedDeps,
      ...getSvelteSharedDeps(sharedDeps),
    })
  }

const getSvelteSharedDeps = (sharedDeps) => ({
  svelte: {
    singleton: true,
    requiredVersion: sharedDeps.svelte ?? 'latest',
  },
})
const getReactSharedDeps = (sharedDeps) => ({
  react: {
    singleton: true,
    requiredVersion: sharedDeps.react ?? 'latest',
  },
  'react-dom': {
    singleton: true,
    requiredVersion: sharedDeps['react-dom'] ?? 'latest',
  },
})

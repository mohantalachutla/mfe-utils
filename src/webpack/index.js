import * as loaders from './loaders'
import * as plugins from './plugins'
import { validateMfeName, validateAndGetRemotes } from './validators'

const validators = {
  validateMfeName,
  validateAndGetRemotes,
}
export default { ...loaders, ...plugins, ...validators }

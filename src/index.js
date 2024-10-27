import * as events from './events'
import * as loader from './loader'
import * as validators from './validators'
import * as plugins from './webpack/plugins'
const utils = { ...events, ...validators, ...plugins, ...loader }

export default utils

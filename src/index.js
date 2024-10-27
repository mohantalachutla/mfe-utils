import * as events from './events'
import * as load from './load'
import * as validate from './validate'
const utils = { ...events, ...validate, ...load }

export default utils

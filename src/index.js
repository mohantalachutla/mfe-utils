import * as events from './events'
import * as validate from './validate'
import * as load from './load'

const utils = { ...events, ...validate, ...load }

export default utils

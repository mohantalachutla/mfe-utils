import { EventEmitter } from 'events'
import { isEmpty, isFunction } from './utils'

const emitter = new EventEmitter()

export const sendEvent = (event, data) => {
  if (isEmpty(event)) {
    throw new Error(`InvalidEvent: event should not be empty`)
  }

  if (isEmpty(data)) {
    throw new Error(`InvalidData: data should not be empty`)
  }
  emitter.emit(event, data)
}

export const subscribeEvent = (event, cb) => {
  if (isEmpty(event)) {
    throw new Error(`InvalidEvent: event should not be empty`)
  }

  if (isEmpty(cb) || !isFunction(cb)) {
    throw new Error(`InvalidCallback: callback is empty or not a function`)
  }
  emitter.on(event, cb)
}

export default { sendEvent, subscribeEvent, emitter }

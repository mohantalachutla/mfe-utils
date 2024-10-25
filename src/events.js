import { EventEmitter } from 'events'
import _ from 'lodash'

const emitter = new EventEmitter()

export const sendEvent = (event, data) => {
  if (_.isEmpty(event)) {
    throw new Error(`InvalidEvent: event should not be empty`)
  }

  if (_.isEmpty(data)) {
    throw new Error(`InvalidData: data should not be empty`)
  }
  emitter.emit(event, data)
}

export const subscribeEvent = (event, cb) => {
  if (_.isEmpty(event)) {
    throw new Error(`InvalidEvent: event should not be empty`)
  }

  if (_.isEmpty(cb)) {
    throw new Error(`InvalidCallback: callback should not be empty`)
  }
  emitter.on(event, cb)
}

import { EventEmitter } from 'events'
import { isEmpty, isFunction } from './utils'

const emitter = new EventEmitter()
export class EventManager {
  register(event, cb) {
    console.debug('EventManager:Register', event, `Function: ${cb?.name}`)
    if (isEmpty(event)) {
      throw new Error(`InvalidEvent: event should not be empty`)
    }

    if (isEmpty(cb) || !isFunction(cb)) {
      throw new Error(`InvalidCallback: callback is empty or not a function`)
    }
    const callback = (...args) => {
      console.debug('EventManager:SideEffect', event, ...args)
      cb(...args)
    }
    emitter.on(event, callback)
  }
  unregister(event, callback) {
    emitter.removeListener(event, callback)
  }
  getEvents() {
    return emitter.eventNames()
  }

  dispatch(event, data, awaiting) {
    console.debug('EventManager:Dispatch', event, data)
    if (isEmpty(event)) {
      throw new Error(`InvalidEvent: event should not be empty`)
    }
    if (awaiting?.event) {
      const timeout = setTimeout(() => {
        throw new Error(`EventManager: Awaiting Timeout: ${awaiting.event}`)
      }, awaiting.timeout ?? 5000)
      emitter.on(awaiting.event, () => {
        console.info('EventManager: Awaiting Fullfilled', awaiting.event)
        clearTimeout(timeout)
      })
    }
    emitter.emit(event, data)
  }
  registerAll(events = {}) {
    // throw if not object<string, function>
    Object.entries(events).forEach(([key, value]) => {
      if (typeof value !== 'function') {
        throw new Error(`registerAll: ${key} should be a function`)
      }
      if (!key || typeof key !== 'string') {
        throw new Error(`registerAll: ${key} should be a string`)
      }
      this.register(key, value)
    })
  }
}

export default new EventManager()

import { add } from './app'

describe('App tests', () => {
  it('has to be 2', () => {
    expect(add()).toBe(2)
  })
})

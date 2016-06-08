import assert from 'assert'
import React from 'react'
import { mount, render, shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import api from 'lib/api'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

class Fixture extends React.Component {
  render() {
    return (
      <div>
        <input id='checked' defaultChecked />
        <input id='not' defaultChecked={ false } />
      </div>
    )
  }
}

describe('(Framework) Karma Plugins', () => {
  it('Expose "expect" globally.', () => {
    assert.ok(expect)
  })

  it('Expose "should" globally.', () => {
    assert.ok(should)
  })

  it('Have chai-as-promised helpers.', () => {
    const pass = new Promise(resolve => resolve('test'))
    const fail = new Promise((resolve, reject) => reject())

    return Promise.all([
      expect(pass).to.be.fulfilled,
      expect(fail).to.not.be.fulfilled
    ])
  })

  it('Have chai-enzyme working', () => {
    let wrapper = shallow(<Fixture />)
    expect(wrapper.find('#checked')).to.be.checked()

    wrapper = mount(<Fixture />)
    expect(wrapper.find('#checked')).to.be.checked()

    wrapper = render(<Fixture />)
    expect(wrapper.find('#checked')).to.be.checked()
  })

  describe('Have redux-mock-store working', () => {
    it('Dispatch action', () => {
      const initialState = {}
      const store = mockStore(initialState)
      const action = {
        type: 'FOO_ACTION'
      }

      store.dispatch(action)

      expect(store.getActions()).to.deep.equal([action])
    })

    it('Execute async action', () => {
      const initialState = {}
      const store = mockStore(initialState)
      const syncAction = () => ({
        type: 'SYNC_ACTION'
      })
      const asyncAction = () => (dispatch) => (
        Promise.resolve().then(() => dispatch(syncAction()))
      )

      return store.dispatch(asyncAction())
        .then(() => {
          expect(store.getActions()).to.deep.equal([syncAction()])
        })
    })
  })

  describe('Mocking ajax', () => {
    let server
    beforeEach(() => {
      server = sinon.fakeServer.create()
      server.autoRespond = true
    })

    afterEach(() => {
      server.restore()
    })

    it('Mock global XMLHttpRequest', () => {
      expect(global.XMLHttpRequest).to.equal(sinon.FakeXMLHttpRequest)
    })

    it('Have sinon fake server working', () => {
      const body = { foo: 'bar' }
      server.respondWith('GET', '/api/v1/foo', [200, { 'Content-Type': 'application/json' }, '{"foo":"bar"}'])
      return expect(api({
        path: 'foo'
      }).entity()).to.eventually.deep.equal(body)
    })
  })
})

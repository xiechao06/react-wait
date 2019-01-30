import React from 'react'
import test from 'tape'
import { Wait } from './index'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sleep from 'sleep-promise'
import { JSDOM } from 'jsdom'

configure({ adapter: new Adapter() })

test('loading', t => {
  let el = <Wait loader={'loading'}>
    {() => null}
  </Wait>

  let wrapped = shallow(el)
  t.equal(wrapped.text(), 'loading')

  t.end()
})

test('succeed', async t => {
  class FooComponent extends React.Component {
    state = {
      succeeded: false
    }

    componentDidMount () {
      setTimeout(() => {
        this.setState({
          succeeded: true
        })
        this.props.loadSucceeded()
      }, 1000)
    }
    render () {
      return this.state.succeeded && <div>foo</div>
    }
  }
  let el = <Wait loader={'loading'}>
    {({ succeed }) => <FooComponent loadSucceeded={succeed} />}
  </Wait>

  const doc = new JSDOM('<!doctype html><html><body></body></html>')
  global.document = doc.window.document
  global.window = doc.window

  let wrapped = mount(el)

  await sleep(1000)
  t.equal(wrapped.children().length, 1)
  t.equal(wrapped.html(), '<div>foo</div>')

  t.end()
})

test('failed', async t => {
  class BarComponent extends React.Component {
    state = {
      failed: false
    }

    componentDidMount () {
      setTimeout(() => {
        this.setState({
          failed: true
        })
        this.props.failed('bar')
      }, 1000)
    }
    render () {
      return null
    }
  }
  let el = <Wait render={'loading'} errorContent={reason => <div>{reason}</div>}>
    {({ fail }) => <BarComponent failed={fail} />}
  </Wait>

  const doc = new JSDOM('<!doctype html><html><body></body></html>')
  global.document = doc.window.document
  global.window = doc.window

  let wrapped = mount(el)

  await sleep(1000)
  t.equal(wrapped.children().length, 1)
  t.equal(wrapped.html(), '<div>bar</div>')

  t.end()
})

test('wait', async t => {
  class BazComponent extends React.Component {
    state = {
      waiting: false
    }

    componentDidMount () {
      setTimeout(() => {
        this.setState({
          waiting: true
        })
        this.props.start('baz')
      }, 1000)
    }

    render () {
      return !this.state.waiting && <div>baz</div>
    }
  }
  let el = <Wait loader={sth => <div>waiting for {sth}</div>}>
    {({ wait }) => <BazComponent start={wait} />}
  </Wait>

  const doc = new JSDOM('<!doctype html><html><body></body></html>')
  global.document = doc.window.document
  global.window = doc.window

  let wrapped = mount(el)

  await sleep(1100)
  t.equal(wrapped.html(), '<div>waiting for baz</div>')

  t.end()
})

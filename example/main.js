import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Wait, STATUS } from './react-wait'

class UserInfo extends Component {
  state = { name: '' }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        name: 'Tom'
      })
      this.props.loadDone()
    }, 3000)
  }

  render () {
    return !!this.state.name && <div>user name is: {this.state.name}</div>
  }
}

class FailedUserInfo extends Component {
  state = { name: '' }

  componentDidMount () {
    setTimeout(() => this.props.loadFailed('I am hungry!'), 3000)
  }

  render () {
    return !!this.state.name && <div>user name is: {this.state.name}</div>
  }
}

class CatchingMouse extends Component {
  state = {
    mouse: null,
    cathing: false
  }

  click = () => {
    this.props.started('catching...')
    this.setState({ cathing: true })
    setTimeout(() => {
      this.setState({
        mouse: 'Jerry',
        cathing: false
      })
      this.props.succeeded()
    }, 1000)
  }

  render () {
    let { mouse } = this.state
    return !this.state.cathing && [
      !!mouse && <div key={0}>{mouse} catched!</div>,
      <button onClick={this.click} key={1}>
        click me to catch mouse { this.state.mouse && 'again '}
      </button>
    ]
  }
}

function App () {
  return <div>
    <h3>example 1</h3>
    <Wait loader={<div>loading will succeed...</div>}>
      {({ succeed }) => <UserInfo loadDone={succeed} />}
    </Wait>
    <h3>example 2</h3>
    <Wait loader={<div>loading will fail...</div>} errorContent={reason => <div>failed!!! because {reason}</div>}>
      {({ fail }) => <FailedUserInfo loadFailed={fail} />}
    </Wait>
    <h3>example 3</h3>
    <Wait initialStatus={STATUS.SUCCEEDED} loader={reason => <div>I am {reason}</div>}>
      {({ wait, succeed, waiting }) => <CatchingMouse started={wait} succeeded={succeed} />}
    </Wait>
  </div>
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

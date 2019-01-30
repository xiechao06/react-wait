import React from 'react'
import PropTypes from 'prop-types'

export const STATUS = {
  WAITING: 'WAITING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED'
}

export class Wait extends React.Component {
  static propTypes = {
    loader: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
    errorContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    children: PropTypes.func.isRequired,
    initialStatus: PropTypes.string
  }

  static defaultProps = {
    initialStatus: STATUS.WAITING
  }

  constructor (props) {
    super(props)
    this.state = {
      status: this.props.initialStatus,
      waitArgs: null,
      failedArgs: null
    }
    let { succeed, fail, wait } = this
    // make sure children mount only once
    this.children = this.props.children({ succeed, fail, wait })
  }

  wait = (args) => {
    this.setState({
      status: STATUS.WAITING,
      waitArgs: args
    })
  }

  succeed = () => {
    this.setState({
      status: STATUS.SUCCEEDED
    })
  }

  fail = (args) => {
    this.setState({
      status: STATUS.FAILED,
      failedArgs: args
    })
  }

  renderLoader = () => {
    let { loader } = this.props
    if (typeof loader === 'function') {
      return loader(this.state.waitArgs)
    }
    return loader
  }

  renderErrorContent = () => {
    let { errorContent } = this.props
    if (typeof errorContent === 'function') {
      return errorContent(this.state.failedArgs)
    }
    return errorContent
  }

  render () {
    let { status } = this.state
    return <React.Fragment>
      { this.children }
      { status === STATUS.WAITING && this.renderLoader() }
      { status === STATUS.FAILED && this.renderErrorContent() }
    </React.Fragment>
  }
}

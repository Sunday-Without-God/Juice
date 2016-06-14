import React, { PropTypes, Component } from 'react'

class Toast extends Component {
  componentDidMount() {
    const { id, timeout, onRequestClose } = this.props
    setTimeout(() => onRequestClose(id), timeout)
  }

  render() {
    const { children, style } = this.props

    return (
      <div style={ style }>
        { children }
      </div>
    )
  }

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object.isRequired,
    timeout: PropTypes.number,
    onRequestClose: PropTypes.func.isRequired,
    id: PropTypes.any.isRequired
  }

  static defaultProps = {
    timeout: 3000
  }
}

export default Toast

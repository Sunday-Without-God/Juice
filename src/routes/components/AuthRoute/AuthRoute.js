import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import GuardRoute from '../GuardRoute'
import {isLoginSelector} from 'redux/modules/account'

function AuthRoute ({isLogin, ...rest}) {
  return (
    <GuardRoute condition={() => !isLogin} redirectPath='/sign-in' {...rest} />
  )
}

AuthRoute.propTypes = {
  isLogin: PropTypes.bool.isRequired
}

export default connect(state => ({isLogin: isLoginSelector(state)}))(AuthRoute)

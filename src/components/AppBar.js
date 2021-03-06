import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import MuiAppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import LeftNav from './LeftNav'
import MenuLinkItem from './MenuLinkItem'

import { fetchUserInfo, logout } from 'redux/modules/account'
import commonStyles from 'lib/styles'

export class AppBar extends React.Component {
  componentDidMount () {
    this.props.fetchUserInfo()
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleToggle = () => {
    this.setState(({ open }) => ({ open: !open }))
  }

  get leftMenu () {
    return (
      <IconButton onClick={this.handleToggle}>
        <MenuIcon />
      </IconButton>
    )
  }

  get rightMenu () {
    const { account, logout } = this.props
    if (account.get('state')) {
      return (
        <div>
          <Link to='/about-us'>
            <FlatButton labelStyle={commonStyles.whiteColor} label='About us' />
          </Link>
          <span
            style={{
              ...commonStyles.whiteColor,
              ...styles.verticalAlign
            }}>
            {account.getIn(['user', 'nickname'])}
          </span>
          <IconMenu
            iconButtonElement={
              <IconButton iconStyle={commonStyles.whiteIcon}>
                <MoreVertIcon />
              </IconButton>
            }
            targetOrigin={styles.origin}
            anchorOrigin={styles.origin}>
            <MenuLinkItem primaryText='Submission' to='/submissions' />
            <MenuItem primaryText='Logout' onClick={logout} />
          </IconMenu>
        </div>
      )
    } else {
      return (
        <div>
          <Link to='/about-us'>
            <FlatButton labelStyle={commonStyles.whiteColor} label='About us' />
          </Link>
          <Link to='/sign-up'>
            <FlatButton labelStyle={commonStyles.whiteColor} label='Signup' />
          </Link>
          <Link to='/sign-in'>
            <FlatButton labelStyle={commonStyles.whiteColor} label='Signin' />
          </Link>
        </div>
      )
    }
  }

  render () {
    return (
      <MuiAppBar
        title={
          <Link style={commonStyles.whiteLink} to='/'>
            Juice
          </Link>
        }
        iconElementLeft={this.leftMenu}
        iconElementRight={this.rightMenu}>
        <LeftNav open={this.state.open} onRequestChange={this.handleClose} />
      </MuiAppBar>
    )
  }

  state = {
    open: false
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    fetchUserInfo: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  }
}

export default connect(
  state => ({
    account: state.account
  }),
  { fetchUserInfo, logout }
)(AppBar)

const styles = {
  origin: {
    horizontal: 'right',
    vertical: 'top'
  },
  verticalAlign: {
    verticalAlign: 'super'
  }
}

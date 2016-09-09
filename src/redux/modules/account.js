import { createAction, handleActions } from 'redux-actions'
import { Record, Map, List } from 'immutable'
import store from 'store'
import { createSelector } from 'reselect'
import { request } from './app'
import { showMessage } from './message'
import { validateForm } from './validation'

export const AccountRecord = new Record({
  valid: false,
  state: false,
  user: new Map()
})

export class Account extends AccountRecord {
  isValid() {
    return this.valid
  }

  isAdmin() {
    return this.isValid() && this.getIn(['user', 'roles'], new List()).includes('admin')
  }

  isLogin() {
    return this.isValid() && this.state
  }
}

export const initialState = new Account()

export const SET_LOGIN_STATE = 'SET_LOGIN_STATE'
export const SET_USER_INFO = 'SET_USER_INFO'
export const CLEAR_USER = 'CLEAR_USER'

export const setLoginState = createAction(SET_LOGIN_STATE, (state = false) => state)
export const setUserInfo = createAction(SET_USER_INFO, (payload) => {
  payload.roles = payload.roles.map((role) => role.name)
  return payload
})
export const clearUser = createAction(CLEAR_USER)

export const login = (username, password) => (dispatch) => {
  const data = { username, password }
  return dispatch(request({
    method: 'post',
    url: 'auth/sign-in',
    data
  }, (data) => {
    store.set('juice-token', data)
    dispatch(fetchUserInfo({ force: true }))
  }, (error) => {
    if (error instanceof Error) {
      throw error
    }

    const { data } = error

    if (data && data.message) {
      dispatch(showMessage(data.message))
    }
  }))
}

export const logout = () => (dispatch) => {
  dispatch(request({
    url: 'auth/sign-out'
  }, () => {
    store.remove('juice-token')
    dispatch(clearUser())
  }))
}

export const fetchUserInfo = (options = { force: false }) => (dispatch, getState) => {
  const { force } = options
  const { account } = getState()
  if (account.get('valid') && !force) {
    return
  }

  if (!store.has('juice-token')) {
    dispatch(setLoginState(false))
    return
  }

  dispatch(request({
    url: 'account/profile'
  }, (data) => {
    dispatch(setUserInfo(data.user))
  }, () => {
    // Token maybe expired here, remove it
    store.remove('juice-token')
    dispatch(setLoginState(false))
  }))
}

export const registerUser = (info) => (dispatch) => {
  const isValidation = dispatch(validateForm(info))

  if (!isValidation) {
    return
  }

  return dispatch(request({
    method: 'post',
    url: 'auth/sign-up',
    data: info
  }, (data) => {
    store.set('juice-token', data)
    dispatch(setUserInfo(info))
  }))
}

// Selectors

export const accountSelector = (state) => state.account
export const isValidSelector = (state) => state.account.get('valid')

export const createIsAdminSelector = () => createSelector(
  [accountSelector],
  (account) => account.isAdmin()
)

export const isNotAdminSelector = createSelector(
  [accountSelector],
  (account) => !account.isAdmin()
)

export const isLoginSelector = createSelector(
  [accountSelector],
  (account) => account.isLogin()
)

// Helper function

export const isLogin = (account) => {
  return account.get('state') || store.has('juice-token')
}

export const actions = {
  login,
  setLoginState,
  setUserInfo,
  fetchUserInfo,
  clearUser,
  registerUser,
  logout
}

export default handleActions({
  [SET_LOGIN_STATE]: (state, { payload }) => state.merge({ valid: true, state: payload }),
  [SET_USER_INFO]: (state, { payload }) => state.merge({ valid: true, state: true, user: payload }),
  [CLEAR_USER]: (state) => state.merge({ valid: true, state: false, user: {} })
}, initialState)

import {connect} from 'react-redux'
import lifecycle from 'recompose/lifecycle'
import withHandlers from 'recompose/withHandlers'
import setDisplayName from 'recompose/setDisplayName'
import wrapDisplayName from 'recompose/wrapDisplayName'
import compose from 'recompose/compose'
import {
  getComponentMessage,
  validateForm,
  setValidationName,
  setValidationRule,
  clearValidationMessage
} from 'redux/modules/validation'

const validateFormHoc = (key, validateRule) => WrappedComponent => {
  const mapStates = state => ({validation: getComponentMessage(state)})

  return compose(
    connect(mapStates, {
      validateForm,
      clearValidationMessage,
      setValidationName,
      setValidationRule
    }),
    lifecycle({
      componentWillMount () {
        this.props.clearValidationMessage(key)
        this.props.setValidationName(key)
        this.props.setValidationRule(validateRule)
      },
      componentWillUnmount () {
        this.props.setValidationName(null)
        this.props.setValidationRule({})
      }
    }),
    withHandlers({
      validateForm: props => (fields, cb) => props.validateForm(fields, cb)
    }),
    setDisplayName(wrapDisplayName(WrappedComponent, 'Validate'))
  )(WrappedComponent)
}

export default validateFormHoc

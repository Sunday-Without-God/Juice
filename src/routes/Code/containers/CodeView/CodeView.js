import CodeView from '../../components/CodeView'
import {connect} from 'react-redux'

import {
  fetchCode,
  fetchSubmission,
  codeSelector,
  submissionSelector,
  needReviewSelector,
  patchSubmissionCorrectness
} from 'redux/modules/submission'
import {createIsAdminSelector} from 'redux/modules/account'

const isAdminSelector = createIsAdminSelector()

export default connect(
  (state, props) => ({
    code: codeSelector(state),
    submission: submissionSelector(state, props),
    canReview: !!(props.match.params.examId && isAdminSelector(state)),
    needReview: needReviewSelector(state, props),
    id: props.match.params.id
  }),
  dispatch => ({
    fetchCode (id) {
      return () => {
        dispatch(fetchCode(id))
        dispatch(fetchSubmission(id))
      }
    },
    patchCorrectness (id) {
      return correctness => {
        dispatch(patchSubmissionCorrectness(id, correctness))
      }
    }
  }),
  (stateProps, {fetchCode, patchCorrectness}, ownProps) => {
    const dispatchProps = {
      fetchCode: fetchCode(stateProps.id),
      patchCorrectness: patchCorrectness(stateProps.id)
    }
    return Object.assign({}, ownProps, stateProps, dispatchProps)
  }
)(CodeView)

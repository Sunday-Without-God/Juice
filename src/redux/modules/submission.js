import {createAction, handleActions} from 'redux-actions'
import {createSelector} from 'reselect'
import {Record, Map} from 'immutable'
import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import {normalize} from 'normalizr'
import {replace} from 'react-router-redux'
import {createFormDataDeep} from 'lib/utils'

import {request, CLEAR_CACHE} from './app'
import {isLogin} from './account'
import {showMessage} from './message'
import submissionSchema from 'schema/submission'

const SubmissionState = new Record({
  result: [],
  entities: {},
  code: ''
})

const initialState = new SubmissionState()

const SET_SUBMISSIONS = 'SET_SUBMISSIONS'
const SET_SUBMISSION = 'SET_SUBMISSION'
const SET_SUBMISSION_CODE = 'SET_SUCMISSION_CODE'
const CLEAR_SUBMISSION_CODE = 'CLEAR_SUBMISSION_CODE'

export const setSubmissions = createAction(SET_SUBMISSIONS, data =>
  normalize(data, [submissionSchema])
)
export const setSubmission = createAction(SET_SUBMISSION, data =>
  normalize(data, submissionSchema)
)
export const setSubmissionCode = createAction(SET_SUBMISSION_CODE)
export const clearSubmissionCode = createAction(CLEAR_SUBMISSION_CODE)

export const submitCode = submitData => dispatch => {
  const {uuid, examId, ...data} = submitData
  return dispatch(
    request(
      {
        method: 'post',
        url: `submissions/${uuid}`,
        data: createFormDataDeep(omitBy({...data, exam_id: examId}, isNil)),
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },
      () => {
        dispatch(showMessage('Submit success'))
      },
      () => {
        dispatch(showMessage('Judge is not running. Please report this to TA.'))
      }
    )
  )
}

export const fetchSubmissions = (opts = {force: false}) => (
  dispatch,
  getState
) => {
  const {submission, account} = getState()
  if (submission.get('result').size && !opts.force) {
    return
  }

  if (!isLogin(account)) {
    dispatch(replace('/sign-in'))
    return
  }

  dispatch(
    request(
      {
        url: '/account/submissions'
      },
      ({submissions}) => {
        dispatch(setSubmissions(submissions))
      }
    )
  )
}

export const fetchExamSubmissions = (id, opts = {force: false}) => dispatch => {
  dispatch(
    request(
      {
        url: `/exams/${id}/submissions`
      },
      ({submissions}) => {
        dispatch(setSubmissions(submissions))
      }
    )
  )
}

export const fetchSubmission = (id, opts = {force: false}) => (
  dispatch,
  getState
) => {
  const {submission} = getState()
  id = `${id}`
  if (submission.hasIn(['entities', 'submission', id]) && !opts.force) {
    return
  }

  dispatch(
    request(
      {
        url: `/submissions/${id}`
      },
      entity => {
        dispatch(setSubmission(entity))
      }
    )
  )
}

export const fetchCode = id => dispatch => {
  dispatch(clearSubmissionCode())
  dispatch(
    request(
      {
        url: `submissions/${id}/code`
      },
      entity => {
        dispatch(setSubmissionCode(entity))
      }
    )
  )
}

export const patchSubmissionCorrectness = (id, correctness) => dispatch => {
  correctness = parseInt(correctness || 0)
  dispatch(
    request({
      method: 'patch',
      url: `submissions/${id}`,
      data: {
        correctness
      }
    })
  )
}

export const isNeedReviewScore = score => score === null || score === -1

const getSubmission = ({submission}) => submission
const getSubmissionWithId = ({submission}, {match: {params: {id}}}) =>
  submission.getIn(['entities', 'submission', id], new Map())

export const codeSelector = createSelector([getSubmission], submission =>
  submission.get('code')
)
export const submissionSelector = createSelector(
  [getSubmissionWithId],
  submission => submission
)

export const needReviewSelector = createSelector(
  [submissionSelector],
  submission => isNeedReviewScore(submission.getIn(['judge', 'score']))
)

export const actions = {
  fetchSubmissions,
  fetchSubmission,
  fetchExamSubmissions,
  patchSubmissionCorrectness,
  setSubmissionCode,
  clearSubmissionCode,
  fetchCode,
  submitCode
}

export default handleActions(
  {
    [SET_SUBMISSIONS]: (state, {payload}) => state.merge(payload),
    [SET_SUBMISSION]: (state, {payload}) => state.merge(payload),
    [CLEAR_CACHE]: () => new SubmissionState(),
    [SET_SUBMISSION_CODE]: (state, {payload}) => state.set('code', payload),
    [CLEAR_SUBMISSION_CODE]: state => state.set('code', '')
  },
  initialState
)

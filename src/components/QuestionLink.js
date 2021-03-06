import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import TitleCard from './TitleCard'
import setDisplayName from 'recompose/setDisplayName'
import setPropTypes from 'recompose/setPropTypes'
import compose from 'recompose/compose'
import styles from 'lib/styles'

const QuestionLink = compose(
  setPropTypes({
    examId: PropTypes.string,
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }),
  setDisplayName('QuestionLink')
)(({examId, uuid, title}) => {
  const quesUrl = `/questions/${uuid}`
  const url = examId ? `/exams/${examId}${quesUrl}` : quesUrl
  return (
    <Link style={styles.noUnderline} to={url}>
      <TitleCard title={title} />
    </Link>
  )
})

export default QuestionLink

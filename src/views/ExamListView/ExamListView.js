import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import Inset from 'layouts/Inset';
import ExamCard from 'components/ExamCard';
import Pagination from 'components/Pagination';
import redirectNotAuth from 'lib/redirectNotAuth';

import styles from 'lib/styles';
import { actions as examActions } from 'redux/modules/exam';
import { createIsAdminSelector } from 'redux/modules/account';
import createMaxPageSelector from 'redux/selectors/maxPageSelector';

class ExamListView extends Component {
  componentDidMount() {
    const { query } = this.props.location;
    this.fetchExams(query, { force: true });
  }

  componentWillReceiveProps(newProps) {
    const { query } = newProps.location;
    if (query.page !== this.props.location.query.page) {
      this.fetchExams(query);
    }
  }

  fetchExams(query, opts) {
    const page = parseInt(query.page) || 1;
    this.props.fetchExams({ page }, opts);
  }

  render() {
    const { exam, maxPage, admin } = this.props;
    const examData = exam.getIn(['entities', 'exam']);
    return (
      <div>
        <Inset>
          {
            exam.get('result').map((id) => {
              return (
                <ExamCard
                  id={ id }
                  key={ id }
                  name={ examData.getIn([`${id}`, 'name']) }
                  beganTime={ examData.getIn([`${id}`, 'began_at']) }
                  endedTime={ examData.getIn([`${id}`, 'ended_at']) }/>
              );
            })
          }
        </Inset>
        <Pagination
          baseUrl='/exams'
          current={ exam.get('page') }
          maxPage={ maxPage } />
        {
          admin ? (
            <Link to='/exams/new'>
              <FloatingActionButton style={ styles.floatBtn } >
                <AddIcon />
              </FloatingActionButton>
            </Link>
          ) : null
        }
      </div>
    );
  }

  static propTypes = {
    maxPage: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    exam: PropTypes.object.isRequired,
    admin: PropTypes.bool.isRequired,
    fetchExams: PropTypes.func.isRequired
  };
}

const maxPageSelector = createMaxPageSelector();
const isAdminSelector = createIsAdminSelector();

export default redirectNotAuth(connect((state) => ({
  exam: state.exam,
  maxPage: maxPageSelector(state.exam),
  admin: isAdminSelector(state)
}), examActions)(ExamListView));

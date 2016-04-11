import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';

import SubmitCode from './SubmitCode';

import { actions as questionActions, questionSelector } from 'redux/modules/question';
import commonStyles from 'lib/styles';

export class Question extends Component {
  componentDidMount() {
    const { expanded } = this.props;
    if (expanded) {
      this.fetchQuestionDetail();
    }
  }

  fetchQuestionDetail() {
    const { question, uuid } = this.props;
    if (question && question.get('detail')) {
      this.setState({ fetched: true });
      return;
    }

    this.props.fetchQuestionDetail(uuid);
  }

  render() {
    const { uuid, question, expanded } = this.props;

    if (expanded) {
      return (
        <Card>
          <CardTitle
            title={ question.get('title') } />
          <CardText style={ styles.textContainer }>
            <div style={ styles.textWrap }>
              { question.get('description') }
            </div>
          </CardText>
          <CardActions>
            <SubmitArea uuid={ uuid }/>
          </CardActions>
        </Card>
      );
    } else {
      return (
        <Link style={ commonStyles.noUnderline } to={ `/question/${uuid}` }>
          <Card>
            <CardTitle
              title={ question.get('title') } />
          </Card>
        </Link>
      );
    }
  }

  state = {
    fetched: false
  };
}

Question.propTypes = {
  uuid: PropTypes.string.isRequired,
  question: PropTypes.object,
  fetchQuestionDetail: PropTypes.func.isRequired,
  expanded: PropTypes.bool
};

export default connect((state, props) => {
  return { question: questionSelector(state, props) };
}, questionActions)(Question);

class SubmitArea extends Component {
  get submitArea() {
    return (
      <SubmitCode
        uuid={ this.props.uuid } />
    );
  }

  render() {
    return (
      <div>
        { this.submitArea }
      </div>
    );
  }

  static propTypes = {
    uuid: PropTypes.string.isRequired
  };
}

const styles = {
  iconBtn: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '4px'
  },
  textContainer: {
    position: 'relative'
  },
  textWrap: {
    marginRight: '54px'
  }
};

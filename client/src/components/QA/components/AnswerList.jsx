import React from 'react';
import _ from 'underscore';
import Answers from './Answers.jsx';

class AnswerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAnswers: _.values(props.answers).length,
      expanded: false,
      expandButton: <span className="a-more" data-testid="a-more" onClick={this.moreAnswers.bind(this)}
        key={`more-a-${this.props.question_id}`}>
        SEE MORE ANSWERS
      </span>
    };
  }

  moreAnswers(e) {
    e.preventDefault();
    this.setState({
      expanded: true,
      expandButton: <span className="a-more" data-testid="a-less" onClick={this.lessAnswers.bind(this)}
        key={`more-a-${this.props.question_id}`}>
        COLLAPSE ANSWERS
      </span>
    });
    this.props.render(e);
  }

  lessAnswers(e) {
    e.preventDefault();
    this.setState({
      expanded: false,
      expandButton: <span className="a-more" data-testid="a-more" onClick={this.moreAnswers.bind(this)}
        key={`more-a-${this.props.question_id}`}>
        SEE MORE ANSWERS
      </span>
    })
    this.props.render(e);
  }

  sortAnswers(answers) {
    let totalA = this.state.totalAnswers;
    let answerValues = _.values(answers);
    if (!this.state.expanded) {
      totalA = 2;
    }

    return _.chain(answerValues)
      .sortBy(answer => { return answer.helpfulness })
      .reverse()
      .partition(user => {
        if (user.answerer_name === 'Seller') {
          return true;
        }
      })
      .flatten()
      .slice(0, totalA)
      .value()
  }

  render() {
    let expandState = this.state.expandButton;

    if (this.state.totalAnswers <= 2) {
      expandState = <></>
    }

    return (
      <div>
        <div className="a-list" data-testid="a-list">
          {_.map(this.sortAnswers(this.props.answers), (a) => {
            return <div key={`aBase-${a.id}`} className="a-list-item" data-testid="a-list-item">
              <Answers answer={a} updateAHelp={this.props.updateAHelp} question_id={this.props.question_id}
                render={this.props.render} />
            </div>
          })}
        </div>
        {expandState}
      </div>
    )
  }
}

export default AnswerList;

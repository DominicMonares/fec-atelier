import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import AnswerList from './AnswerList.jsx';
import AnswerQuestion from './AnswerQuestion.jsx';
import AskQuestion from './AskQuestion.jsx';

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedQuestions: [],
      totalQuestions: 0,
      questionCount: 2,
      votes: [],
      more: false
    };
  }

  handleQuestions(e) {
    e.preventDefault();
    this.props.getQAData();
    this.setState({
      totalQuestions: this.props.questions.length,
      questionCount: this.props.questions.length,
      more: true
    })
    this.focusQuestions(e);
    this.props.render(e);
  }

  questionIsHelpful(e) {
    e.preventDefault();
    let questionClasses = e.target.className;
    let secondClass = questionClasses.split(' ')[1];
    let subClasses = secondClass.split('-');
    let question_id = Number(subClasses[2]);
    let questionHelpCount = subClasses[3];

    if (!this.state.votes.includes(question_id)) {
      let newVotes = this.state.votes.slice();
      newVotes.push(question_id);
      $.ajax({
        url: `/qa/questions/${question_id}/helpful`,
        method: 'PUT',
        success: () => {
          this.setState({votes: newVotes});
          this.props.updateQHelp(question_id);
          this.props.render(e);
        },
        error: err => {
          alert(err);
        }
      })
    }
  }

  answersExist(answers) {
    if (_.values(answers).length === 0) {
      return;
    } else {
      return <span className="a-label">A:</span>
    }
  }

  handleScroll(e) {
    e.preventDefault();
    const wrapped = $('.questions').get(0);
    if (wrapped.offsetHeight + wrapped.scrollTop >= wrapped.scrollHeight - 1) {
      this.scrollUpdate(e);
    }
  }

  scrollUpdate(e) {
    e.preventDefault();
    if (this.state.more) {
      this.props.getQAData();
      this.setState({
        totalQuestions: this.props.questions.length,
        questionCount: this.props.questions.length
      })
    }
  }

  focusQuestions(e) {
    e.preventDefault();
    $('html, body').scrollTop($('#qa').offset().top);
  }

  render() {
    let totalQs = this.props.questions.length;
    let more;
    if (totalQs > this.state.questionCount && totalQs > 2 && !this.state.more) {
      more = <button key="more-q" className="more-q"
        onClick={this.handleQuestions.bind(this)}>
        MORE ANSWERED QUESTIONS
      </button>;
    } else {
      more = <></>
    }

    return <div>
      <a className="jumper" aria-label="jumper" href=".questions"></a>
      <div key="questions" className="questions" data-testid="questions" onScroll={this.handleScroll.bind(this)}>
        <ul className="q-base">
          {_.map(this.props.questions.slice(0, this.state.questionCount), q => {
            return <li className="question" data-testid={q.question_body}
              key={`${q.question_body}-${q.question_id}`}
            >
              <div key={`q-${q.question_id}`}>
                <div className="q-header">
                  <div>
                    <span className="q-label">Q:</span>
                    <span className="q-body">{q.question_body}</span>
                  </div>
                  <div className="q-bar">
                    <div className="q-helpful-bar">
                      <span className="q-helpful">Helpful?</span>&nbsp;
                      <span className={`q-help-count q-help-${q.question_id}-${q.question_helpfulness}`}
                        onClick={this.questionIsHelpful.bind(this)}>
                        <span className={`q-help-count q-help-${q.question_id}-${q.question_helpfulness}`}>
                          Yes
                        </span>&nbsp;{`(${q.question_helpfulness})`}
                      </span>
                    </div>
                    <span className="vertical-bar">|</span>
                    <AnswerQuestion question_id={q.question_id} updateAnswers={this.props.updateAnswers}
                      product_id={this.props.product_id}
                      product_name={this.props.product_name}
                      question_body={q.question_body}
                      render={this.props.render} />
                  </div>
                </div>
                <div className="a-label-list">
                  {this.answersExist(q.answers)}
                  <AnswerList answers={q.answers} question_id={q.question_id}
                    updateAHelp={this.props.updateAHelp}
                    render={this.props.render} />
                </div>
              </div>
            </li>
          })}
        </ul>
      </div>
      {more}
      <AskQuestion key="ask-question" className="ask-question"
        getQAData={this.props.getQAData}
        updateQuestions={this.props.updateQuestions}
        product_id={this.props.product_id}
        product_name={this.props.product_name}
        render={this.props.render} />
    </div>
  }
}

export default Questions;

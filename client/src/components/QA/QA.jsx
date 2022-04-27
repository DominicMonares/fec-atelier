import React from 'react';
import $ from 'jquery';
import _ from 'underscore';

import SearchQuestion from './components/SearchQuestion.jsx';
import Questions from './components/Questions.jsx';

class QA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalQuestions: [],
      questions: [],
      page: 1,
      product_name: '',
      loaded: false
    };
  }

  searchQuestions(e) {
    e.preventDefault();
    let text = e.target.value;
    if (text.length >= 3) {
      this.setState({
        questions: this.sortByTerm(this.state.originalQuestions, text)
      })
    } else {
      this.setState({questions: this.revertQuestions(this.state.originalQuestions)});
    }
  }

  revertQuestions(questions) {
    return _.map(questions, q => {
      let questionBody = q.question_body;
      let newQuestion = [];
      if (typeof questionBody !== 'string') {
        _.each(questionBody, qb => {
          if (typeof qb !== 'string') {
            let reverted = qb.props.children;
            newQuestion.push(reverted);
          } else {
            newQuestion.push(qb);
          }
        })

        q.question_body = newQuestion.join('');
        return q;
      } else {
        return q;
      }
    })
  }

  sortByTerm(questions, sortTerm) {
    let filtered = _.filter(this.revertQuestions(questions), q => {
      if (q.question_body.toLowerCase().includes(sortTerm.toLowerCase())) {
        return true;
      }
    })

    return _.map(filtered, q => {
      let questionBody = q.question_body.split('');
      let newQuestion = [];
      for (let i = 0; i < questionBody.length; i++) {
        if (questionBody.slice(i, i + sortTerm.length).join('').toLowerCase() === sortTerm.toLowerCase()) {
          newQuestion.push(<mark>{questionBody.slice(i, i + sortTerm.length).join('')}</mark>);
          i += sortTerm.length - 1;
        } else {
          newQuestion.push(questionBody[i]);
        }
      }

      q.question_body = newQuestion;
      return q;
    })
  }

  getQAData() {
    if (!this.state.loaded) {
      $.ajax({
        url: `/qa/questions/${this.props.itemid}/${this.state.page}`,
        method: 'GET',
        success: data => {
          if (data.results.length < 3 && this.state.page !== 1) {
            this.setState({ loaded: true });
          } else {
            let newQuestions = _.flatten(this.state.originalQuestions.slice().concat(data.results));
            let newPage = this.state.page + 1;
            this.setState({
              questions: newQuestions,
              originalQuestions: newQuestions,
              page: newPage
            })
          }
        }
      })
    }
  }

  getProductName() {
    $.ajax({
      url: `/products/${this.props.itemid}`,
      method: 'GET',
      success: data => {
        this.setState({
          product_name: data.name
        });
      },
      error: err => {
        alert(err);
      }
    })
  }

  updateQuestionHelp(question_id) {
    let questionIndex;
    let updatedQuestions = _.map(this.state.originalQuestions, (q, index) => {
      if (q.question_id === question_id) {
        q.question_helpfulness ++;
        questionIndex = index;
        return q;
      } else {
        return q;
      }
    })

    if (typeof questionIndex === 'number') {
      let currentHelpfulness = updatedQuestions[questionIndex].question_helpfulness;
      if (questionIndex !== 0 && currentHelpfulness > updatedQuestions[questionIndex - 1].question_helpfulness) {
        let placeholder = updatedQuestions[questionIndex];
        updatedQuestions[questionIndex] = updatedQuestions[questionIndex - 1];
        updatedQuestions[questionIndex - 1] = placeholder;
      }
    }

    this.setState({
      originalQuestions: updatedQuestions,
      questions: updatedQuestions
    })
  }

  updateAnswerHelp(answer_id, question_id) {
    let updatedAnswers = _.map(this.state.originalQuestions, q => {
      if (q.question_id === question_id) {
        q.answers = _.each(q.answers, a => {
          if (a.id === answer_id) {
            a.helpfulness ++;
          }
        })

        return q;
      } else {
        return q;
      }
    })

    this.setState({
      originalQuestions: updatedAnswers,
      questions: updatedAnswers
    })
  }

  updateQuestions(question) {
    if (this.state.loaded) {
      let newQuestions = this.state.originalQuestions.slice();
      newQuestions.push(question);
      this.setState({
        originalQuestions: newQuestions,
        questions: newQuestions
      });
    }
  }

  updateAnswers(question_id, answer) {
    let newQuestions = this.state.originalQuestions.slice();
    _.each(newQuestions, (q, index) => {
      if (q.question_id === question_id) {
        newQuestions[index]['answers'][answer.id] = answer;
      }
    })

    this.setState({
      originalQuestions: newQuestions
    });
  }

  componentDidMount() {
    this.getQAData();
    this.getProductName();
  }

  render() {
    let state = this.state;
    return (
      <div data-testid="qa" id="qa">
        <span className="qa-title">{'QUESTIONS & ANSWERS'}</span>
        <SearchQuestion searchQuestions={this.searchQuestions.bind(this)} render={this.props.render}/>
        <Questions questions={state.questions} updateQHelp={this.updateQuestionHelp.bind(this)}
            updateAHelp={this.updateAnswerHelp.bind(this)}
            updateAnswers={this.updateAnswers.bind(this)}
            updateQuestions={this.updateQuestions.bind(this)}
            getQAData={this.getQAData.bind(this)}
            product_id={this.props.itemid}
            product_name={this.state.product_name}
            render={this.props.render} />
      </div>
    )
  }
}

export default QA;

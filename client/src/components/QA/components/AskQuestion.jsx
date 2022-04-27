import React from 'react';
import Modal from 'react-modal';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons'

// Modal.setAppElement('#app');

class AskQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      nickname: '',
      email: '',
      product_name: '',
      modalOpen: false,
      invalid: ''
    };
  }

  openModal(e) {
    e.preventDefault();
    this.setState({
      modalOpen: true,
      product_name: this.props.product_name
    });
    this.props.render(e);
  }

  closeModal(e) {
    e.preventDefault();
    this.setState({modalOpen: false, invalid: ''});
    this.props.render(e);
  }

  handleQuestion(e) {
    e.preventDefault();
    this.setState({question: e.target.value})
  }

  handleNickname(e) {
    e.preventDefault();
    this.setState({nickname: e.target.value})
  }

  handleEmail(e) {
    e.preventDefault();
    this.setState({email: e.target.value})
  }

  dataIsValid() {
    let validation = _.chain(_.values(this.state))
    .slice(0, 3)
    .every((input, index) => {
      if (input.length === 0) {
        return false;
      } else if (index === 2 && !this.emailIsValid()) {
        return false;
      } else {
        return true;
      }
    })
    .value()

    return validation;
  }

  emailIsValid() {
    let splitEmail = this.state.email.split('@');
    if (splitEmail.length === 2) {
      splitEmail[1] = splitEmail[1].split('.');
      let flattenedEmail = _.flatten(splitEmail);
      if (flattenedEmail.length === 3) {
        return true;
      }
    }

    return false;
  }

  submitQuestion(e) {
    e.preventDefault();
    let questionData = {
      body: this.state.question,
      name: this.state.nickname,
      email: this.state.email,
      product_id: this.props.product_id
    };

    if (this.dataIsValid()) {
      $.ajax({
        url: `/qa/questions`,
        method: 'POST',
        data: questionData,
        success: (res) => {
          let newQuestion = {
            question_id: Math.floor(Math.random() * (650000 - 600000 + 1)) + 600000,
            question_body: this.state.question,
            question_date: moment().local().format('YYYY-MM-DD').concat('T00:00:00.000Z'),
            asker_name: this.state.nickname,
            question_helpfulness: 0,
            reported: false,
            answers: {}
          };

          this.closeModal(e);
          this.props.updateQuestions(newQuestion);
        },
        error: err => {
          alert(err);
        }
      })
    } else {
      this.setState({invalid: <div className="invalid-qa">You must enter the following:</div>});
    }
  }

  render() {
    const modalStyle = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #000',
        borderRadius: '0px',
        fontFamily: 'sans-serif'
      }
    };

    return (
      <div className="question-modal" data-testid="question-modal">
        <button className="ask-question-btn" onClick={this.openModal.bind(this)}>
          ASK A QUESTION&nbsp;&nbsp;&nbsp;
          <FontAwesomeIcon className="qa-plus-icon" icon={faPlus}></FontAwesomeIcon>
        </button>
        <Modal
          isOpen={this.state.modalOpen}
          style={modalStyle}
          contentLabel="Ask Your Question"
        >
          <div className="qa-modal-top">
            <span className="q-modal-ask">Ask your question about the {this.state.product_name}</span>
            <span className="close-qa-modal" data-testid="close-qa-modal" onClick={this.closeModal.bind(this)}>X</span>
          </div>
          {this.state.invalid}
          <div className="qa-modal-form" data-testid="qa-modal-form">
            <div className="qa-modal-input">
              <label className="qa-modal-label" htmlFor="your-q">{'Your Question (mandatory)'}</label>
              <textarea className="your-q" data-testid="your-q" maxLength="1000"
                onChange={this.handleQuestion.bind(this)}>
              </textarea>
            </div>
            <div className="qa-modal-sub-form">
              <div className="qa-modal-input">
                <label className="qa-modal-label" htmlFor="nickname-q">{'What is your nickname? (mandatory)'}</label>
                <input type="text" className="nickname-q" maxLength="60" placeholder="Example: jackson11!"
                  onChange={this.handleNickname.bind(this)}>
                </input>
                <div className="privacy-msg">For privacy reasons, do not use your full name or email address</div>
              </div>
              <div className="qa-modal-input">
                <label className="qa-modal-label" htmlFor="email-q">{'Your Email (mandatory)'}</label>
                <input type="text" className="qa-modal email-q" maxLength="60" placeholder="Example: jack@email.com"
                  onChange={this.handleEmail.bind(this)}>
                </input>
                <div className="privacy-msg">For authentication reasons, you will not be emailed</div>
              </div>
            </div>
            <button className="qa-modal-submit" onClick={this.submitQuestion.bind(this)}>SUBMIT QUESTION</button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default AskQuestion;

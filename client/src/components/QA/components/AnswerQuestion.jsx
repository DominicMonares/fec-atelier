import React from 'react';
import Modal from 'react-modal';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';
import API_KEYS from '../../../../../env/config.js';

// Modal.setAppElement('#app');

class AnswerQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      nickname: '',
      email: '',
      photos: [],
      product_name: '',
      modalOpen: false,
      invalid: '',
      thumbnails: <></>,
      addPhoto: <button className="add-a-photo" onClick={this.addPhotos.bind(this)}>ADD PHOTOS</button>
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

  handleAnswer(e) {
    e.preventDefault();
    this.setState({answer: e.target.value})
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

  addPhotos(e) {
    e.preventDefault();
    const client = filestack.init(API_KEYS.FILESTACK_API_KEY);
    let options = {
      fromSources: ['local_file_system'],
      accept: ['image/*'],
      maxFiles: 5,
      disableTransformer: true,
      onFileSelected: file => {
        if (file.size > 1000 * 1000) {
          alert('File too big, select something smaller than 1MB');
        }
      },
      onFileUploadFinished: file => {
        let updatedPhotos = this.state.photos.slice();
        updatedPhotos.push(file.url);

        let updatedThumbnails = <div className="a-modal-thumbnails">{_.map(updatedPhotos, photo => {
          return <img className="a-modal-thumbnail" key={photo} src={photo} alt="Answer Thumbnail" />
        })}</div>

        this.setState({photos: updatedPhotos, thumbnails: updatedThumbnails});
        if (this.state.photos.length === 5) {
          this.setState({addPhoto: <></>})
        }
      },
      onFileUploadFailed: file => {
        alert('File upload failed');
      }
    };

    client.picker(options).open();
  }

  submitAnswer(e) {
    e.preventDefault();
    let answerData = {
      body: this.state.answer,
      name: this.state.nickname,
      email: this.state.email,
      photos: this.state.photos
    };

    if (this.dataIsValid()) {
      $.ajax({
        url: `/qa/question/${this.props.question_id}/answers`,
        method: 'POST',
        data: answerData,
        success: () => {
          this.closeModal(e);
          let newAnswer = {
            id: Math.floor(Math.random() * (6500000 - 6000000 + 1)) + 6000000,
            body: this.state.answer,
            date: moment().local().format('YYYY-MM-DD').concat('T00:00:00.000Z'),
            answerer_name: this.state.nickname,
            helpfulness: 0,
            photos: this.state.photos
          };

          this.props.updateAnswers(this.props.question_id, newAnswer);
          this.setState({invalid: '', photos: []})
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
      <div className="answer-modal" data-testid="answer-modal">
        <span className="add-answer" data-testid="add-answer" onClick={this.openModal.bind(this)}>
          <u>Add Answer</u>
        </span>
        <Modal
          isOpen={this.state.modalOpen}
          style={modalStyle}
          contentLabel="Submit Your Answer"
        >
          <div className='qa-modal-top'>
            <span className="q-modal-answer">Submit your answer</span>
            <span className="close-qa-modal" data-testid="close-qa-modal" onClick={this.closeModal.bind(this)}>X</span>
          </div>
          <span className="a-modal-subtitle">{this.state.product_name}: {this.props.question_body}</span>
          {this.state.invalid}
          <div className="qa-modal-form">
            <div className="qa-modal-input">
              <label className="qa-modal-label" htmlFor="your-a">{'Your Answer (mandatory)'}</label>
              <textarea className="qa-modal your-a" maxLength="1000"
                onChange={this.handleAnswer.bind(this)}>
              </textarea>
            </div>
            <div className="qa-modal-sub-form">
              <div className="qa-modal-input">
                <label className="qa-modal-label" htmlFor="nickname-a">{'What is your nickname? (mandatory)'}</label>
                <input type="text" className="qa-modal nickname-a" maxLength="60" placeholder='Example: jack543!'
                  onChange={this.handleNickname.bind(this)}>
                </input>
                <div className="privacy-msg">For privacy reasons, do not use your full name or email address</div>
              </div>
              <div className="qa-modal-input">
                <label className="qa-modal-label" htmlFor="email-a">{'Your Email (mandatory)'}</label>
                <input type="text" className="qa-modal email-a" maxLength="60" placeholder='Example: jack@email.com'
                  onChange={this.handleEmail.bind(this)}>
                </input>
                <div className="privacy-msg">For authentication reasons, you will not be emailed</div>
              </div>
            </div>
            {this.state.thumbnails}
            <div className="a-modal-buttons">
              {this.state.addPhoto}
              <button className="qa-modal-submit" onClick={this.submitAnswer.bind(this)}>SUBMIT ANSWER</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default AnswerQuestion;

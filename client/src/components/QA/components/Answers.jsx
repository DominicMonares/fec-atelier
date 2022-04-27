import React from 'react';
import Modal from 'react-modal';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';

Modal.setAppElement('#app');

class Answers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reported: false,
      votes: [],
      thumbnails: <></>,
      modalOpen: false,
      currentImg: ''
    };
  }

  answerIsHelpful(e) {
    e.preventDefault();
    let answerClasses = e.target.className;
    let secondClass = answerClasses.split(' ')[1];
    let subClasses = secondClass.split('-');
    let answer_id = Number(subClasses[2]);
    let questionHelpCount = subClasses[3];

    if (!this.state.votes.includes(answer_id)) {
      let newVotes = this.state.votes.slice();
      newVotes.push(answer_id);
      $.ajax({
        url: `/qa/answers/${answer_id}/helpful`,
        method: 'PUT',
        success: () => {
          this.setState({votes: newVotes})
          this.props.updateAHelp(answer_id, this.props.question_id);
          this.props.render(e);
        },
        error: err => {
          alert(err);
        }
      })
    }
  }

  report(e) {
    e.preventDefault();
    let reportClasses = e.target.className;
    let secondClass = reportClasses.split(' ')[1];
    let answer_id = Number(secondClass.split('-')[1]);

    $.ajax({
      url: `/qa/answers/${answer_id}/report`,
      method: 'PUT',
      success: () => {
        this.setState({reported: true});
        this.props.render(e);
      },
      error: err => {
        alert(err);
      }
    })
  }

  openModal(e) {
    e.preventDefault();
    let image = e.target.src;
    this.setState({
      modalOpen: true,
      currentImg: image
    })
  }

  closeModal(e) {
    e.preventDefault();
    this.setState({
      modalOpen: false
    })
  }

  componentDidMount() {
    let answer = this.props.answer;
    if (answer.photos.length > 0) {
      this.setState({thumbnails: <div className="a-thumbnails">{_.map(answer.photos, (photo, index) => {
        return <img className="a-thumbnail" key={photo.concat(index)} src={photo} alt="Answer Thumbnail"
          onClick={this.openModal.bind(this)} />
      })}</div>})
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
        border: '0px',
        borderRadius: '0px',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        fontFamily: 'sans-serif',
        overflow: 'auto'
      }
    };

    let answer = this.props.answer;
    let answerer = answer.answerer_name;
    if (answerer === 'Seller') {
      answerer = <b>Seller</b>
    }

    let reportButton = <span className={`report report-${answer.id}`}
      onClick={this.report.bind(this)}>Report
    </span>
    if (this.state.reported) {
      reportButton = <span className="reported">Reported</span>
    }

    return (<ul className="answers" data-testid="answers">
      <li key={`a-${answer.id}`} data-testid={answerer}>
        <span className="answer-body">{answer.body}</span>
        {this.state.thumbnails}
        <div className="a-bar">
          <span className="answerer">by {answerer}, {moment(answer.date).format('LL')}</span>
          <span className="vertical-bar">|</span>
          <div className="a-helpful-bar">
            <span className="a-helpful">Helpful?</span>&nbsp;
            <span className={`a-help-count a-help-${answer.id}-${answer.helpfulness}`}
              onClick={this.answerIsHelpful.bind(this)}>
              <span className={`help-yes a-help-${answer.id}-${answer.helpfulness}`}>
                Yes
              </span>&nbsp;{`(${answer.helpfulness})`}
            </span>
          </div>
          <span className="vertical-bar">|</span>
          {reportButton}
        </div>
      </li>
      <Modal
        isOpen={this.state.modalOpen}
        style={modalStyle}
        contentLabel="View Image"
      >
        <div className="a-thumbnail-modal">
          <span className="close-a-thumbnail" onClick={this.closeModal.bind(this)}>X</span>
          {<img className="a-clicked-thumbnail" src={this.state.currentImg}></img>}
        </div>
      </Modal>
    </ul>)
  }
}

export default Answers;

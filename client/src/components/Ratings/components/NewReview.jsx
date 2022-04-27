import React from 'react';
import Modal from 'react-modal';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import StarRating from './StarRating.jsx';
import InputProductBreakdowns from './InputProductBreakdowns.jsx';
import API_KEYS from '../../../../../env/config.js';
import axios from 'axios';
import _ from 'underscore';

class NewReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product_id: this.props.item_id,
      rating: 0,
      summary: '',
      body: '',
      chars_needed: 50,
      recommend: true,
      recommend_chosen: false,
      name: '',
      email: '',
      photos: [],
      thumbnails: <></>,
      characteristics: {},
      modalOpen: false,
      stars: ['images/white_star.png', 'images/white_star.png', 'images/white_star.png', 'images/white_star.png', 'images/white_star.png'],
      star_meaning: '',
      thumbnails: <></>,
      addPhoto: <button className="add_photo" onClick={this.addPhotos.bind(this)}>ADD PHOTOS</button>
    };
    this.handleSummaryChange = this.handleSummaryChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.addPhotos = this.addPhotos.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleRecommendChange = this.handleRecommendChange.bind(this);
    this.updateCharacteristics = this.updateCharacteristics.bind(this);
  }

  openModal(e) {
    e.preventDefault();
    this.props.render(e);
    this.setState({
      modalOpen: true,
      product_name: this.props.product_name
    });
  }

  closeModal(e) {
    //e.preventDefault();
    this.props.render(e);
    this.setState({modalOpen: false});
    //refresh questions list
  }

  chooseStars(e) {
    e.preventDefault();
    this.props.render(e);

    let starNum = parseInt((e.target.className).slice(5));
    let newMeaning = '';

    if (starNum === 1) {
      newMeaning = 'Poor';
    } else if (starNum === 2) {
      newMeaning = 'Fair';
    } else if (starNum === 3) {
      newMeaning = 'Average';
    } else if (starNum === 4) {
      newMeaning = 'Good';
    } else if (starNum === 5) {
      newMeaning = 'Great';
    }

    let newStars = this.state.stars;

    for (let i = 0; i < starNum; i++) {
      newStars[i] = 'images/black_star.png';
    }

    this.setState({
      stars: newStars,
      star_meaning: newMeaning,
      rating: starNum
    });
  }

  handleSummaryChange(e) {
    e.preventDefault();
    this.props.render(e);
    this.setState({ summary: e.target.value });
  }

  handleRecommendChange(e) {
    e.preventDefault();
    this.props.render(e);
    this.setState({
      recommend: e.target.value,
      recommend_chosen: true
    });
  }

  handleBodyChange(e, state) {
    e.preventDefault();
    this.props.render(e);
    let charsNeeded = 49 - this.state.body.length;
    this.setState({
      body: e.target.value,
      chars_needed: charsNeeded
    });
  }

  handleNameChange(e) {
    this.props.render(e);
    e.preventDefault();
    this.setState({ name: e.target.value });
  }

  handleEmailChange(e) {
    this.props.render(e);
    e.preventDefault();
    this.setState({ email: e.target.value });
  }

  addPhotos(e) {
    this.props.render(e);
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
          return <img className="a-modal-thumbnail" key={photo} src={photo}></img>
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

  updateCharacteristics(characteristic, value, characteristics) {
    let workingCharacteristics = this.state.characteristics;
    let key = characteristics[characteristic].toString();
    workingCharacteristics[key] = parseInt(value);
    this.setState({
      characteristics: workingCharacteristics
    })
  }

  submitReview(e) {
    this.props.render(e);
    e.preventDefault();

    let warning = 'You must enter the following: '

    if (this.state.star_meaning === '') {
      warning = warning + 'star rating cannot be blank, '
    }

    if (this.state.recommend_chosen === false) {
      warning = warning + 'you must choose to recommend or not, '
    }

    if (this.state.body.length < 50) {
      warning = warning + 'review body must be at least 50 characters, '
    }

    if (this.state.name === '') {
      warning = warning + 'nickname cannot be blank, '
    }

    if (!this.state.email.includes('@') || !this.state.email.includes('.')) {
      warning = warning + 'needs to include a properly formatted email (Example: jackson11@email.com), '
    }

    if (warning.length > 30) {
      let trimmedAlert = warning.substr(0, warning.length - 2);
      alert(trimmedAlert);

    } else {
      let dataObject = {
        product_id: this.props.item_id,
        rating: this.state.rating,
        summary: this.state.summary,
        body: this.state.body,
        recommend: this.state.recommend,
        name: this.state.name,
        email: this.state.email,
        photos: this.state.photos,
        characteristics: this.state.characteristics
      };

      this.postNewReview(dataObject, (error, result) => {
        if (error) {
          console.log('error sending new review from client: ', error);
        } else {
          console.log('success posting new review: ', result);
        }
      });
      this.closeModal();

      //refresh to show data.

    }
  }

  async postNewReview(dataObject, callback) {

    await axios.post('/reviews/question/new_review', {
      data: dataObject
    })
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        callback(error);
      })
  }

  render(props) {

    let characteristics = this.props.ratings_characteristics;

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
      <div className="new_review_modal">
        <button className="btn" onClick={this.openModal.bind(this)}>
          ADD A REVIEW&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
        </button>
        <Modal
          isOpen={this.state.modalOpen}
          style={modalStyle}
          contentLabel="Post Your Review">
          <div className="new_review_meta">
            <span className="modal_label"><h3>Write your review...</h3> ...about the {this.props.item_name}</span>
          </div>
          <div className="review_modal_form">
            <div className="review_modal_input">
              <br></br>
              How would you rate this product?*&nbsp;
              <img src={this.state.stars[0]} alt='loading' width="20" height="20"className=".star1" onClick={this.chooseStars.bind(this)}/>
              <img src={this.state.stars[1]} alt='loading' width="20" height="20"className=".star2" onClick={this.chooseStars.bind(this)}/>
              <img src={this.state.stars[2]} alt='loading' width="20" height="20"className=".star3" onClick={this.chooseStars.bind(this)}/>
              <img src={this.state.stars[3]} alt='loading' width="20" height="20"className=".star4" onClick={this.chooseStars.bind(this)}/>
              <img src={this.state.stars[4]} alt='loading' width="20" height="20"className=".star5" onClick={this.chooseStars.bind(this)}/>
              &nbsp;<span>{this.state.star_meaning}</span>
              <br></br><br></br>
              <div onChange={this.handleRecommendChange} value={this.state.recommend}>Do you recommend this product?*
                <input type="radio" value="true" name="recommend"/> Yes
                <input type="radio" value="false" name="recommend" /> No
              </div>
              <div>
                <InputProductBreakdowns render={this.props.render} characteristics={characteristics} update_characteristics={this.updateCharacteristics}></InputProductBreakdowns>
              </div>
              <br></br><br></br><br></br><br></br><br></br><br></br>
              <br></br><br></br><br></br><br></br><br></br><br></br>
              <div>Please include a brief summary:
              <br></br>
                <textarea value={this.state.summary} name="summary" onChange={this.handleSummaryChange} rows={4} maxLength={60} placeholder={"Example: Best purchase ever!"}/>
                <br></br>
              </div>
              <br></br>
              <div>Please write your full review here:*
              <br></br>
                <textarea value={this.state.body} name="body" onChange={this.handleBodyChange} rows={8} maxLength={1000} placeholder={"Why did you like the product or not?"}/>
                <br></br>
                {this.state.chars_needed > 0 ? <span>Minimum required characters left: {this.state.chars_needed}</span> : <span>Minimum characters reached</span>}
              </div>
              <div>
                <button onClick={this.addPhotos}>UPLOAD PHOTOS</button>
              </div>
              <br></br>
              <div>What is your nickname?*
              <br></br>
                <textarea value={this.state.name} name="name" onChange={this.handleNameChange} maxLength={60} placeholder={"Example: jackson11!"}/>
                <br></br>
                For privacy reasons, do not use your full name or email address
                <br></br>
              </div>
              <div>Your email:*
              <br></br>
                <textarea value={this.state.email} name="email" onChange={this.handleEmailChange} maxLength={60} placeholder={"Example: jackson11@email.com"}/>
                <br></br>
                For authentication reasons, you will not be emailed
                <br></br>
              </div>
              <div className="left">
                <br></br><br></br>
                <button onClick={this.submitReview}>SUBMIT REVIEW</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default NewReview;

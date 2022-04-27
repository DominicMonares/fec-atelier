import React from 'react';
import moment from 'moment';
import StarRating from './StarRating.jsx';
import ReviewImages from './ReviewImages.jsx';

class IndividualReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: this.props.body,
      truncatedBody: this.props.body.slice(0, 249),
      truncated: false,
      helpfulCount: 0,
      helpfulClicked: false
    };
    this.updateHelpfulClicked = this.updateHelpfulClicked.bind(this);
  }

  showMore(e) {
    this.setState({truncated: false});
    this.props.render(e);
  }

  componentDidMount() {
    if (this.state.truncatedBody !== this.state.body) {
      this.setState({truncated: true});
    }

    this.setState({helpfulCount: this.props.helpfulness});
  }

  updateHelpfulClicked() {
    this.setState({
      helpfulCount: this.state.helpfulCount + 1,
      helpfulClicked: true
    })
  }

  render(props) {

    if (this.props) {

      const review_id = this.props.review_id;
      const date = this.props.date;
      const star_rating = this.props.star_rating;
      const summary = this.props.summary;
      const reviewer_name = this.props.reviewer_name;
      const recommend = this.props.recommend;
      const response = this.props.response;
      const body = this.state.body;
      const truncatedBody = this.state.truncatedBody;
      const photos = this.props.photos;
      const helpful = this.state.helpfulCount;
      const chooseHelpful = this.props.chooseHelpful;
      const putMarkHelpful = this.props.putMarkHelpful;

      return (
          <li data-testid="individual-review" className="individual_review">
            <div>
              <span className="individual_star_rating"><StarRating star_rating={star_rating}></StarRating></span><span className="user_name_date">{reviewer_name}, {moment(date).format('LL')}</span>
            </div>
          <br></br><br></br><b>{summary}</b>
          {this.state.truncated ? <div>{truncatedBody}<br></br><button render={this.props.render} onClick={this.showMore.bind(this)} >Show More</button></div>: <div>{body}</div>}
          <br></br><ReviewImages render={this.props.render} photos={photos}></ReviewImages>
          <br></br> {recommend ? <img src={'images/transparent-background-check-mark.png'} alt='loading' width="10" height="10"/>: null}{recommend ? " I recommend this product.": null}
          <br></br><br></br>
          {response ? <div className="review_response">Response from seller:<br></br>{response}</div>: null}
          <br></br>
          <span>Helpful? {!this.state.helpfulClicked ? <span className="review_helpful" onClick={(e) => { chooseHelpful(review_id, e); this.updateHelpfulClicked();} }>Yes</span> : <span className="review_helpful">Yes</span>} ({helpful})</span>
          </li>
      )
    } else {
      return (<div></div>)
    }
  }
}

export default IndividualReview;

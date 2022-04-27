import React from 'react';
import IndividualReview from './IndividualReview.jsx';
import NewReview from './NewReview.jsx';

class RatingsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item_id: this.props.ratings_meta.product_id,
      sort: this.props.sort,
      ratings: this.props.ratings,
      count: this.props.count,
      count_to_display: this.props.count_to_display,
      ratings_to_display: this.props.ratings_to_display,
      filters: this.props.filters
    };
    this.handleChange = this.handleChange.bind(this);
    this.moreReviews = this.moreReviews.bind(this);
    this.filterData = this.filterData.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.props.render(e);
    this.props.handleSort(e.target.value);
  }

  componentDidMount(props){

    this.props.getAllReviews(this.state.item_id, this.state.sort, 100, (error, result) => {
      if (error) {
        console.log('client reports retrieve reviews error: ', error.message);
      } else {
        this.props.updateDisplayedItems(result);
      }
    })
  }

  moreReviews(e) {
    this.props.render(e);
    if (this.props) {
      this.props.moreReviews();
    }
  }

  filterData() {
    let array = this.state.ratings
    let results = [];

    if (!this.state.filters.includes(true)) {
      results = array;
    } else {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < 5; j++) {
          if (this.state.filters[j] === true && j + 1 === parseInt(array[i].rating)) {
            results.push(array[i]);
          }
        }
      }
    }
    this.setState({ratings: results});
  }

  render(props) {

    const chooseHelpful = this.props.chooseHelpful;

    const putMarkHelpful= this.props.putMarkHelpful;
    let recommend_total = 0;
    let count_to_display = this.state.count_to_display;

    if (this.props.ratings_meta) {
      const recommended = this.props.ratings_meta.recommended;

      for (const key in recommended) {
      recommend_total += parseInt(recommended[key]);
      }
    }

    let ratings = this.props.ratings_to_display.map((rating) => {
      return (
          <IndividualReview render={this.props.render} chooseHelpful={chooseHelpful} putMarkHelpful={putMarkHelpful} key={rating.review_id} review_id={rating.review_id}
          star_rating={rating.rating} summary={rating.summary} date={rating.date} body={rating.body} recommend={rating.recommend}
          reviewer_name={rating.reviewer_name} response={rating.response} helpfulness={rating.helpfulness} photos={rating.photos}></IndividualReview>
      )
    });

    return(
      <div data-testid="ratings-list" className="ratings_list_widget">
        <div className="review_sort_bar">
          <form>
            <b>{recommend_total} <span>reviews, sorted by </span></b>
            <select value={this.state.sort} onChange={this.handleChange}>
              <option value="relevant">Relevant</option>
              <option value="newest">Newest</option>
              <option value="helpful">Helpful</option>
            </select>
          </form>
            <br></br>
        </div>
          <div className="visible_scrollbar">
            <ul className="ratings_list">{ratings}</ul>
          </div>
          <div>
            <span>{(count_to_display < recommend_total) ? <div><button className="btn" onClick={this.moreReviews}>MORE REVIEWS</button></div>: null}<NewReview
            render={this.props.render} item_name={this.props.item_name} item_id={this.props.item_id} ratings_characteristics={this.props.ratings_meta.characteristics} className="new_review"></NewReview></span>
          </div>
      </div>
    )
  }
}

export default RatingsList;

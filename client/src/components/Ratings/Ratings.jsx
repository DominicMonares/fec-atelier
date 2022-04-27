import React from 'react';
import RatingsList from './components/RatingsList.jsx';
import RatingsMeta from './components/RatingsBreakdown.jsx';
import axios from 'axios';

class Ratings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item_id: this.props.item_id,
      item_name: '',
      ratings: [],
      ratings_meta: {},
      sort: 'Relevant',
      count: 0,
      count_to_display: 2,
      ratings_to_display: [],
      filters: [false, false, false, false, false],
      any_filters: false
    }
    this.getAllReviews = this.getAllReviews.bind(this);
    this.getReviewsMeta = this.getReviewsMeta.bind(this);
    this.chooseHelpful = this.chooseHelpful.bind(this);
    this.putMarkHelpful = this.putMarkHelpful.bind(this);
    this.flipFilters = this.flipFilters.bind(this);
    this.filterData = this.filterData.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.moreReviews = this.moreReviews.bind(this);
    this.updateDisplayedItems = this.updateDisplayedItems.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidMount(props){

    this.getReviewsMeta(this.state.item_id, (error, result) => {
      if (error) {
        console.log('client reports retrieve reviews meta error: ', error);
      } else {
        let recommend_total = 0;
        const recommended = result.recommended;

        for (const key in recommended) {
        recommend_total += parseInt(recommended[key]);
        }

        this.setState({
          ratings_meta: result,
        });
      }
    })

    this.getProductData(this.state.item_id, (error, result) => {
      if (error) {
        console.log('client reports retrieve name error: ', error);
      } else {
        this.setState({item_name: result});
      }
    })

    if (this.state.ratings_to_display.length === 0) {
      this.getAllReviews(this.state.item_id, this.state.sort, 100, (error, result) => {
        if (error) {
          console.log('client reports retrieve reviews error: ', error.message);
        } else {
          this.setState({
            count: result.length,
            ratings: result,
            ratings_to_display: result.slice(0, 2)
          });
        }
      })
    }
  }

  chooseHelpful(review_id) {

    this.putMarkHelpful(review_id, (error, result) => {
      if (error) {
        console.log('error at choose helpful in individual review: ', error);
      }
    })
  }

  flipFilters(val) {

    let flipFilterState = this.state.filters;

    if (val === '1 stars') {
      flipFilterState[0] = !flipFilterState[0];
      this.setState({filters: flipFilterState})
    } else if (val === '2 stars') {
      flipFilterState[1] = !flipFilterState[1];
      this.setState({filters: flipFilterState})
    } else if (val === '3 stars') {
      flipFilterState[2] = !flipFilterState[2];
      this.setState({filters: flipFilterState})
    } else if (val === '4 stars') {
      flipFilterState[3] = !flipFilterState[3];
      this.setState({filters: flipFilterState})
    } else if (val === '5 stars') {
      flipFilterState[4] = !flipFilterState[4];
      this.setState({filters: flipFilterState})
    }
  }

  clearFilters() {
    let filterState = this.state.filters;
    for (let i = 0; i < 5; i++) {
      filterState[i] = false;
    }
    this.setState({
      filters: filterState,
      any_filters: false
  });
  }

  async putMarkHelpful(review_id, callback) {

    await axios.put('/reviews/mark_helpful', {
      data : {
        "review_id" : review_id
      }
    })
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        console.log('error putting helpful from individual review: ', error);
        callback(error);
      })
  }

  async getAllReviews(item_id, sort, count, callback) {
    await axios.get('/ratings', {
      headers : {
        "item_id" : this.state.item_id,
        "sort" : sort,
        "count" : count
      }
    })
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        console.log('ratings list failure in client from axios: ', error);
        callback(error);
      })
  }

  async getReviewsMeta(item_id, callback) {
    await axios.get('/reviews/meta', {
      headers : {
        "item_id" : item_id
      }
    })
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        console.log('ratings meta failure in client from axios: ', error);
        callback(error);
      })
  }

  async getProductData(item_id, callback) {
    await axios.get(`products/${item_id}`)
      .then((result) => {
        callback(null, result.data.name);
      })
      .catch((err) => {
        console.error(err.message)
      });
  }

  filterData() {

    if (this.state.ratings.length > 0) {
      let array = this.state.ratings;
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
      this.setState({
        ratings_to_display: results.slice(0, this.state.count_to_display),
        any_filters: this.state.filters.includes(true)
      });
    }
  }

  handleSort(val) {

    this.setState({
      sort: val,
    }, () => {
        this.getAllReviews(this.state.item_id, this.state.sort, this.state.count, (error, result) => {
          if (error) {
            console.log('ratings list reports retrieve reviews error: ', error.message);
          } else {
            this.setState({
              ratings: result,
              ratings_to_display: result.slice(0, this.state.count_to_display)
            });
          }
        })
      }
    )
  }

  moreReviews() {

    let howMany = this.state.count_to_display + 2;
    let reviewsToMove = this.state.ratings.slice(0, howMany);

    this.setState((state, props) => ({
      count_to_display: howMany,
      ratings_to_display: reviewsToMove
    }));
  }

  updateDisplayedItems(result) {

    this.setState({
      ratings: result,
      ratings_to_display: result.slice(0, 2)
    });
  }

  render() {

    return (
      <div data-testid="ratings" className="ratings-widget">
        <a id="reviews-link"></a>
        <h3>RATINGS & REVIEWS</h3>
        <br></br><RatingsMeta render={this.props.render} item_id={this.state.item_id} sort={this.state.sort} filters={this.state.filters} className="ratings_meta" ratings_meta={this.state.ratings_meta}
        getAllReviews={this.getAllReviews.bind(this)} clear_filters={this.clearFilters} count={this.state.count} flip_filters={this.flipFilters} filter_data={this.filterData}
        any_filters={this.state.any_filters} ></RatingsMeta><RatingsList render={this.props.render} className="ratings_list" updateDisplayedItems={this.updateDisplayedItems} moreReviews={this.moreReviews}
        handleSort={this.handleSort} ratings_to_display={this.state.ratings_to_display} ratings_meta={this.state.ratings_meta} filters={this.state.filters} item_id={this.state.item_id}
        count={this.state.count} count_to_display={this.state.count_to_display} item_name={this.state.item_name} chooseHelpful={this.chooseHelpful} putMarkHelpful={this.putMarkHelpful}
        getAllReviews={this.getAllReviews.bind(this)} all_reviews={this.state.ratings}></RatingsList>
      </div>
    );
  }
}

export default Ratings;

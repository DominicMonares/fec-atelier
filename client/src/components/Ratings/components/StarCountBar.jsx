import React from 'react';

class StarCount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.flipFilter = this.flipFilter.bind(this);
  }

  flipFilter(e) {
    this.props.render(e);
    this.props.flip_filters(e.target.innerHTML);
    this.props.filter_data();
  }

  render(props) {

    const star_count = this.props.star_count;
    const star_number = this.props.star_number;
    const bar_style = {
      width: star_count + '%'
    }


    if (isNaN(star_count)) {
      return (
        <li>
          <br></br>{star_number} stars <span className="star_bar"></span>
        </li>
      );
    } else {
      return (
        <li>
          <br></br><span className="star_bar_outer" onClick={this.flipFilter}>{star_number} stars</span><span className="star_bar" style={bar_style}></span><span className="star_bar_under"></span>
        </li>
      );
    }
  }
}

export default StarCount;

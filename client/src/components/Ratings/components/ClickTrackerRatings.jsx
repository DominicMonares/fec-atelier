import React from 'react';
import axios from 'axios';

class ClickTrackerOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: '',
      time: ''
    };
  }

  sendMetrics(e) {
    let metrics = {
      element: e.target.className,
      widget: 'Overview',
      time: new Date()
    }
    axios.post('/interactions', metrics)
    .then(result => {
      //console.log('recorded click', metrics);
    })
    .catch(err => {
      console.log('couldnt register click', err);
    })
  }

  render() {
    return (
      <div>
        {this.props.render(this.sendMetrics)}
      </div>
    )
  }
}

export default ClickTrackerOverview;

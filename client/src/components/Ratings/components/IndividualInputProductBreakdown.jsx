import React from 'react'

class IndividualInputProductBreakdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characteristic: this.props.characteristic,
      rating: 0,
      selectedRadio: 'none selected',
      characteristics: this.props.characteristics_obj
    }
    this.updateRadial = this.updateRadial.bind(this);
  }

  updateRadial(e) {
    this.props.render(e);
    let values = [];

    if (this.state.characteristic === 'Comfort') {

      values = ['Uncomfortable', 'Slightly uncomfortable', 'Ok', 'Comfortable', 'Perfect'];

    } else if (this.state.characteristic === 'Fit') {

      values = ['Runs tight', 'Runs slightly tight', 'Perfect', 'Runs slightly long', 'Runs long'];

    } else if (this.state.characteristic === 'Length') {

      values = ['Runs short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long'];

    } else if (this.state.characteristic === 'Quality') {

      values = ['Poor', 'Below average', 'What I expected', 'Pretty great', 'Perfect'];

    } else if (this.state.characteristic === 'Size') {

      values = ['A size too small', '½ a size too small', 'Perfect', '½ a size too big', 'A size too wide'];

    } else if (this.state.characteristic === 'Width') {

      values = ['Too narrow', 'Slightly narrow', 'Perfect', 'Slightly wide', 'Too wide'];

    }

    this.setState({
      rating: e.target.value,
      selectedRadio: values[e.target.value - 1]
    })

    this.props.update_characteristics(this.state.characteristic, e.target.value, this.state.characteristics)
  }



  render(props) {

    const characteristic = this.state.characteristic;
    const rating = this.state.rating
    let label1 = '';
    let label5 = '';

    let radials = <span><input onClick={this.updateRadial.bind(this)} type="radio" value="1" name={characteristic}/>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <input onClick={this.updateRadial.bind(this)} type="radio" value="2" name={characteristic}/>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <input onClick={this.updateRadial.bind(this)} type="radio" value="3" name={characteristic}/>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <input onClick={this.updateRadial.bind(this)} type="radio" value="4" name={characteristic}/>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <input onClick={this.updateRadial.bind(this)} type="radio" value="5" name={characteristic}/></span>

    if (characteristic === 'Comfort') {
      label1 = 'Uncomfortable';
      label5 = 'Perfect';

      return (
        <div>
          <li className="char_list_item left">
            <span className="indent_less">{this.state.selectedRadio}</span>
            <br></br>
          <span>
            <div className="left">{characteristic}*</div>
            {radials}
            <br></br>
          </span>
          <span className="left indent">{label1}</span><span className="right">{label5}</span>
          <br></br><br></br>
          </li>
          <br></br>
        </div>
      )
    } else if (characteristic === 'Fit') {
      label1 = 'Runs tight';
      label5 = 'Runs long';

      return (
        <div>
          <li className="char_list_item left">
            <span className="indent">{this.state.selectedRadio}</span>
            <br></br>
          <span>
            {characteristic}*
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {radials}
            <br></br>
          </span>
          <span className="left indent">{label1}</span><span className="right">{label5}</span>
          <br></br><br></br>
          </li>
          <br></br>
        </div>
      )
    } else if (characteristic === 'Length') {
      label1 = 'Runs short';
      label5 = 'Runs long';

      return (
        <div>
          <li className="char_list_item left">
          <span className="indent">{this.state.selectedRadio}</span>
            <br></br>
          <span>
            {characteristic}*
            &nbsp;
            {radials}
            <br></br>
          </span>
          <span className="left indent">{label1}</span><span className="right">{label5}</span>
          <br></br><br></br>
          </li>
          <br></br>
        </div>
      )
    } else if (characteristic === 'Quality') {
      label1 = 'Poor';
      label5 = 'Perfect';

      return (
        <div>
          <li className="char_list_item left">
          <span className="indent">{this.state.selectedRadio}</span>
            <br></br>
          <span>
            {characteristic}*
            &nbsp;
            {radials}
            <br></br>
          </span>
          <span className="left indent">{label1}</span><span className="right">{label5}</span>
          <br></br><br></br>
          </li>
          <br></br>
        </div>
      )
    } else if (characteristic === 'Size') {
      label1 = 'A size too small';
      label5 = 'A size too wide';

      return (
        <div>
          <li className="char_list_item left">
            <span className="indent">{this.state.selectedRadio}</span>
            <br></br>
          <span>
            {characteristic}*
            &nbsp;
            {radials}
            <br></br>
          </span>
          <span className="left indent">{label1}</span><span className="right">{label5}</span>
          <br></br><br></br>
          </li>
          <br></br>
        </div>
      )
    } else if (characteristic === 'Width') {
      label1 = 'Too narrow';
      label5 = 'Too wide';

      return (
        <div>
          <li className="char_list_item left">
            <span className="indent">{this.state.selectedRadio}</span>
            <br></br>
          <span>
            {characteristic}*
            &nbsp;
            {radials}
            <br></br>
          </span>
          <span className="left indent">{label1}</span><span className="right">{label5}</span>
          <br></br><br></br>
          </li>
          <br></br>
        </div>
      )
    }

  }
}

export default IndividualInputProductBreakdown;

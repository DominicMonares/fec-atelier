import React from 'react';
import IndividualInputProductBreakdown from './IndividualInputProductBreakdown.jsx';

const InputProductBreakdowns = (props) => {

  if (props.characteristics) {

    const outerCharacteristics = props.characteristics;
    let characteristicsList = [];
    let characteristicsObj = {};

    for (const key in outerCharacteristics) {
      characteristicsList.push(outerCharacteristics[key].inner_characteristic);
      characteristicsObj[key] = outerCharacteristics[key].id;
    }

    let listItems = characteristicsList.map((characteristic) => {
        return (
          <IndividualInputProductBreakdown render={props.render} key={characteristic} characteristic={characteristic}
          characteristics_obj={characteristicsObj} update_characteristics={props.update_characteristics}/>
        )
      });

      return (
        <ul className="list">
          {listItems}
        </ul>
      );
  }
}

export default InputProductBreakdowns;

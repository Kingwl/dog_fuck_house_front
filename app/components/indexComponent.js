import React from 'react';
import Map from './mapComponent';
import Sidebar from './sidebarComponent';

const Component = React.Component;

import '../style/index.scss';

export default class IndexComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedPlace: {}, x: 116.39742, y: 39.90923, time: 30, policy: 'SUBWAY,BUS' };
  }

  placeSelected(x) {
    this.setState({ x: x.location.B, y: x.location.I });
  }

  timeChanged(x) {
    this.setState({ time: x });
  }

  policyChanged(x) {
    this.setState({ policy: x });
  }

  clamp(min, max, x) {
    if (x <= min) return min;
    else if (x >= max) return max;
    return x;
  }

  render() {
    let {x, y, time, policy} = this.state;

    return (
      <div className="index">
        <Map x={x} y={y} time={this.clamp(1, 60, time) } policy={policy}/>
        <Sidebar
          onTimeChanged={x => this.timeChanged(x) }
          onPolicyChanged={x => this.policyChanged(x) }
          onPlaceSelected={x => this.placeSelected(x) } />
      </div>
    );
  }
};
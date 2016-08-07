import React from 'react';
import {Spin } from 'antd';
import Request from 'superagent';

import Map from './mapComponent';
import Sidebar from './sidebarComponent';

const Component = React.Component;

import '../style/index.scss';

export default class IndexComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, houseList: [], selectedPlace: {}, x: 116.39742, y: 39.90923, time: 30, policy: 'SUBWAY,BUS' };
  }

  componentDidMount() {
    this.setState({ loading: true });
    Request.get('http://localhost:4567/')
      .end((err, data) => {
        this.setState({ loading: false });
        if (!err && data) {
          let json = JSON.parse(data.text);
          this.setState({ houseList: json.data });
        } else {
          console.log('no');
        }
      });
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
    let {loading, x, y, time, policy, houseList} = this.state;

    return (
      <div className="index">
        <Map x={x} y={y} time={this.clamp(1, 60, time) } policy={policy} houses={houseList}/>
        <Spin spinning={loading} tip="正在读取数据...">
          <Sidebar
            onTimeChanged={x => this.timeChanged(x) }
            onPolicyChanged={x => this.policyChanged(x) }
            onPlaceSelected={x => this.placeSelected(x) } />
        </Spin>
      </div>
    );
  }
};
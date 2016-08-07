import React from 'react';
import {Slider, Radio} from 'antd';

const Component = React.Component;
const RadioGroup = Radio.Group;

import '../style/policy.scss';

export default class PolicyComponent extends Component {
    get marks() {
        return {
            1: '1',
            15: '15',
            30: '30',
            45: '45',
            60: '60'
        }
    }

    constructor(props) {
        super(props);

        this.state = { time: 30, policy: null }
    }

    static propTypes: {
        onTimeChanged: React.PropTypes.func,
        onPolicyChanged: React.PropTypes.func,
    }

    timeChanged(value) {
        const {onTimeChanged} = this.props;
        this.setState({ time: value });

        if (typeof onTimeChanged === 'function') {
            onTimeChanged(value);
        }
    }

    policyChanged(e) {
        const {value} = e.target;
        const {onPolicyChanged} = this.props;
        this.setState({ policy: value });

        if (typeof onPolicyChanged === 'function') {
            onPolicyChanged(value);
        }
    }

    render() {
        const {time, policy} = this.state;
        return (
            <div className="policy">
                <div className="time">
                    <Slider value={time} onChange={e => this.timeChanged(e) }
                        defaultValue={30} min={1} max={60}
                        setp={1} marks={this.marks}/>
                </div>
                <div className="policyType">
                    <RadioGroup onChange={e => this.policyChanged(e) } value={policy}>
                        <Radio key={1} value="BUS"> 公交 </Radio>
                        <Radio key={2} value="SUBWAY"> 地铁 </Radio>
                        <Radio  key={3} value="SUBWAY,BUS"> 公交 + 地铁 </Radio>
                    </RadioGroup>
                </div>
            </div>
        );
    }
}
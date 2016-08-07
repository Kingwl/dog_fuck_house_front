import React from 'react';
import Search from './searchComponent';
import Policy from './policyComponent';

const Component = React.Component;

import '../style/sidebar.scss';

export default class SidebarComponent extends Component {
    static propTypes: {
        onTimeChanged: React.PropTypes.func,
        onPolicyChanged: React.PropTypes.func,
        onPlaceSelected: React.PropTypes.func
    }
    render() {
        const {onTimeChanged, onPolicyChanged, onPlaceSelected} = this.props;
        return (
            <div className="sidebar">
                <Policy onTimeChanged={onTimeChanged} onPolicyChanged={onPolicyChanged} />
                <Search onPlaceSelected={onPlaceSelected} />
            </div>
        );
    }
}
import React from 'react';
import {Form, Input, Radio} from 'antd';

const Component = React.Component;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import '../style/search.scss';

let Count = 0;

export default class SearchComponent extends Component {
    get timeOutVal() {
        return this._timeOutVal;
    }

    set timeOutVal(value) {
        this._timeOutVal = value;
    }

    static propTypes: {
        onPlaceSelected: React.PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = { text: '', validStatus: '', helpText: '', val: [], selectedPlace: null };
    }

    onTextChange(e) {
        const {value} = e.target;
        this.setState({ text: value });

        clearTimeout(this.timeOutVal);

        if (value && value.length > 0) {
            this.setState({ val: [], helpText: '', validStatus: 'validating' });

            this.timeOutVal = setTimeout(() => {
                var autoOptions = {
                    city: "010"
                };
                var autocomplete = new AMap.Autocomplete(autoOptions);
                autocomplete.search(value, (status, result) => {
                    if (status === 'complete') {
                        this.setState({ helpText: result.info, val: result.tips, validStatus: 'success' });
                    } else if (status === 'error') {
                        this.setState({ helpText: result, validStatus: 'error' });
                    } else if (status === 'no_data') {
                        this.setState({ helpText: '没有找到结果', validStatus: 'success' });
                    }
                });
            }, 500);
        }
    }

    onSelectChange(e) {
        const {onPlaceSelected} = this.props;
        const {value} = e.target;

        this.setState({ selectedPlace: value });

        if (typeof onPlaceSelected === 'function') {
            onPlaceSelected(value);
        }
    }

    render() {
        const {text, validStatus, helpText, val, selectedPlace} = this.state;

        return (
            <div className="search">
                <Form>
                    <FormItem hasFeedback validateStatus={validStatus} help={helpText}>
                        <Input value={text} onChange={e => this.onTextChange(e) }/>
                    </FormItem>
                    <RadioGroup onChange={e => this.onSelectChange(e) } value={selectedPlace}>
                        {
                            val.map(x => {
                                return (
                                    <Radio className="searchResult" key={Count++} value={x}>
                                        {x.name + ' - ' + x.district}
                                    </Radio>
                                );
                            })
                        }
                    </RadioGroup>
                </Form>
            </div>
        )
    }
}

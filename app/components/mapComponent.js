import React from 'react';
import {Input} from 'antd';

const Component = React.Component;

import '../style/map.scss';

export default class MapComponent extends Component {
    get map() {
        return this._map;
    }
    set map(val) {
        this._map = val;
    }

    get centerMarker() {
        return this._centerMarker;
    }
    set centerMarker(val) {
        this._centerMarker = val;
    }

    get rangePoints() {
        if (!this._rangePoints) {
            this.rangePoints = [];
        }
        return this._rangePoints;
    }

    set rangePoints(val) {
        this._rangePoints = val;
    }

    static propTypes: {
        x: React.PropTypes.number,
        y: React.PropTypes.number,
        time: React.PropTypes.number,
        policy: React.PropTypes.string
    }

    addCenterMarker(x, y) {
        if (this.centerMarker) {
            this.centerMarker.setMap(null);
        }
        this.centerMarker = new AMap.Marker({
            map: this.map,
            position: [x, y]
        });
    }

    delPolygon() {
        this.map.remove(this.rangePoints);
        this.rangePoints = [];
    }

    findRange() {
        let {x, y, time, policy} = this.props;

        var arrivalRange = new AMap.ArrivalRange();
        this.addCenterMarker(x, y);

        arrivalRange.search([x, y], time, (status, result) => {
            this.delPolygon();
            if (result.bounds) {
                for (let bound of result.bounds) {
                    var polygon = new AMap.Polygon({
                        map: this.map,
                        fillColor: "#FF0000",
                        fillOpacity: "0.4",
                        strokeColor: "#00FF00",
                        strokeOpacity: "0.5",
                        strokeWeight: 1
                    });
                    polygon.setPath(bound);
                    this.rangePoints.push(polygon);
                }

                this.map.setFitView();
            }
        }, { policy });
    }

    componentDidMount() {
        const {x, y} = this.props;
        this.map = new AMap.Map("container", {
            resizeEnable: true,
            zoomEnable: true,
            center: [x, y],
            zoom: 10
        });

        this.findRange();
    }

    render() {
        const {x, y, time, policy} = this.props;

        this.findRange();
        return (
            <div className="map" id="container"></div>
        );
    }
}
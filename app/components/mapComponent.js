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

    createHouseMarker() {
        const {houses = []} = this.props;
        let geocoder = new AMap.Geocoder({
            city: "010",
            radius: 1000
        });
        houses.forEach(house => {
            let arr = house.place.split();
            geocoder.getLocation(`${arr[0]} ${arr[1]}`, (status, result) => {
                if (status === 'complete' && result.info === 'OK') {
                    let geocode = result.geocodes[0];
                    
                    rentMarker = new AMap.Marker({
                        map: this.map,
                        position: [geocode.location.getLng(), geocode.location.getLat()]
                    });
                }
            });
        })
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
        this.createHouseMarker();

        return (
            <div className="map" id="container"></div>
        );
    }
}

MapComponent.propTypes = {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    time: React.PropTypes.number,
    policy: React.PropTypes.string,
    houses: React.PropTypes.arrayOf(React.PropTypes.shape({
        sale: React.PropTypes.string,
        url: React.PropTypes.string,
        place: React.PropTypes.string,
        type: React.PropTypes.string,
        size: React.PropTypes.string,
        floor: React.PropTypes.string,
        short_rent: React.PropTypes.bool,
        dist: React.PropTypes.string,
        specs: React.PropTypes.arrayOf(React.PropTypes.string),
        money: React.PropTypes.string,
        month: React.PropTypes.string
    }))
}
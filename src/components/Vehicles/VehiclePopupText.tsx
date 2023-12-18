import _ from 'lodash';
import React from 'react';

interface VehiclePopupTextProps {
    vehicle: string;
    route: PTRouteProperties;
    delay: number;
    timestamp: number;
}

const VehiclePopupText: React.FC<VehiclePopupTextProps> = ({ vehicle, route, delay, timestamp }) => {
    const formatDelay = (delay: number): string => {
        const delayInMinutes = _.round(Math.abs(delay) / 60, 1);
        if (delay > 0) return '+' + delayInMinutes + ' min';
        if (delay < 0) return '-' + delayInMinutes + ' min';
        return delayInMinutes + 'min';
    };
    const delayStyle: React.CSSProperties = {
        color: delay > 0 ? 'red' : 'green',
        fontWeight: 'bolder',
    };

    const formatTimestamp = (time: number): string => {
        const date = new Date(time * 1000);
        return date.toLocaleTimeString();
    };

    return (
        <div>
            <div>
                <b> Vehicle: </b>
                {vehicle}
            </div>
            <div>
                <b> Type: </b>
                {route.route_type}
            </div>
            <div>
                <b> Line number: </b>
                {route.line_number}
            </div>
            <div>
                <b> Origin: </b>
                {route.origin}
            </div>
            <div>
                <b> Destination: </b>
                {route.destination}
            </div>
            <div>
                <b> Route agency: </b>
                {route.agency_id}
            </div>
            <div>
                <b> Delay: </b>
                <span style={delayStyle}>{formatDelay(delay)}</span>
            </div>
            <div>
                <b> Updated at: </b>
                {formatTimestamp(timestamp)}
            </div>
        </div>
    );
};

export default VehiclePopupText;

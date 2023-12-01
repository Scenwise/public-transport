import { Marker } from 'mapbox-gl';

import { vehicleTypesMap } from '../../data/data';

export const getVehiclePopupText = (vehicle: string, route: string, delay: number): string => {
    return (
        '<div>' +
        '\n' +
        '<div><b> Vehicle: </b>' +
        vehicle +
        '</div>' +
        '<div><b> Route: </b>' +
        route +
        '</div>' +
        '<div><b> Delay: </b>' +
        formatDelay(delay) +
        '</div>' +
        '</div>'
    );
};

const formatDelay = (delay: number): string => {
    if (delay > 0) return delay + ' sec <b> late </b>';
    else if (delay < 0) return delay * -1 + ' sec <b> early </b>';
    else return '<b> on time </b>';
};

export const getMarkerColorBasedOnVehicleType = (type: string): string => {
    if (type === '') {
        type = 'Other';
    }
    const enumValue = vehicleTypesMap[type as keyof typeof vehicleTypesMap];
    return enumValue.color;
};

export const addNewLabelToVehicle = (marker: Marker): void => {
    // Create HTML element for label
    const newLabel = document.createElement('div');
    newLabel.className = 'new-label';
    newLabel.textContent = 'New!';

    // Style the label
    newLabel.style.backgroundColor = 'white';
    newLabel.style.padding = '1px';
    newLabel.style.borderRadius = '5px';
    newLabel.style.border = '1px solid red';
    newLabel.style.color = 'red';
    newLabel.style.fontSize = '15px';
    newLabel.style.fontWeight = 'bold';
    newLabel.style.position = 'absolute';
    newLabel.style.top = '-20px';
    newLabel.style.left = '-6px';

    marker.getElement().appendChild(newLabel);
    setTimeout(() => {
        newLabel.parentNode?.removeChild(newLabel);
    }, 1000);
};

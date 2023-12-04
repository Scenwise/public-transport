/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { Marker } from 'mapbox-gl';

import { vehicleTypes } from '../../data/data';
import { COLOR_ROUTE_SELECTED } from '../../data/layerPaints';
import { updateSelectedRoute } from '../../dataStoring/slice';

export const getVehiclePopupText = (vehicle: string, route: string, delay: number): string => {
    return (
        '<div>' +
        '\n' +
        '<div><b> Vehicle: </b>' +
        vehicle +
        '</div>' +
        '<div><b> Line number: </b>' +
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
    const value = vehicleTypes.get(type);
    return value === undefined ? 'black' : value.color;
};

export const styleMarker = (
    marker: Marker,
    selectedMarker: React.MutableRefObject<MarkerColorPair>,
    dispatch: Dispatch<AnyAction>,
    routeId: number,
): void => {
    const markerElement = marker.getElement();
    markerElement.style.cursor = 'pointer';
    markerElement.addEventListener('click', () => {
        // Bring back previously selected marker to initial color
        if (selectedMarker.current.marker !== undefined) {
            setMarkerColor(selectedMarker.current.marker, selectedMarker.current.color);
        }

        // Set new marker as selected
        const oldColor = getMarkerColor(markerElement);
        console.log(selectedMarker.current)
        selectedMarker.current = {
            color: oldColor,
            marker: marker,
        };

        // Set new marker color as red
        setMarkerColor(marker, COLOR_ROUTE_SELECTED);
        dispatch(updateSelectedRoute(routeId + ''));
    });
};

const setMarkerColor = (marker: Marker, color: string) => {
    const markerElement = marker.getElement();
    const svg = markerElement.getElementsByTagName('svg')[0];
    const path = svg.getElementsByTagName('path')[0];
    path.setAttribute('fill', color);
};

const getMarkerColor = (markerElement: HTMLElement): string => {
    const svg = markerElement.getElementsByTagName('svg')[0];
    const path = svg.getElementsByTagName('path')[0];
    const color = path.getAttribute('fill');
    return color === null ? 'black' : color;
};

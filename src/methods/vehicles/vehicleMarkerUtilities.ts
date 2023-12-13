/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import mapboxgl, { Marker, Popup } from 'mapbox-gl';
import { createElement } from 'react';

import { createRoot } from 'react-dom/client';

import VehiclePopupText from '../../components/Vehicles/VehiclePopupText';
import { vehicleTypes } from '../../data/data';
import { COLOR_ROUTE_SELECTED } from '../../data/layerPaints';
import { updateSelectedRoute } from '../../dataStoring/slice';

export const getVehiclePopup = (vehicle: string, route: PTRouteProperties, delay: number, timestamp: number): Popup => {
    const popupText = createElement(VehiclePopupText, { vehicle, route, delay, timestamp });
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(popupText);
    return new Popup().setDOMContent(container);
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
    selectedMarker: React.MutableRefObject<SelectedMarkerColor>,
    dispatch: Dispatch<AnyAction>,
    routeId: number,
    map: mapboxgl.Map,
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
        selectedMarker.current = {
            color: oldColor,
            marker: marker,
        };

        map.flyTo({
            center: marker.getLngLat(),
            zoom: 13,
        });
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

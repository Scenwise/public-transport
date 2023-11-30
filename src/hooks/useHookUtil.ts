/**
 * Updates paint properties of a layer
 * @param map - the mapboxgl map
 * @param layerID - the layer that the mouse is hovering over
 * @param property `color` | `width` | `fill-color` | `fill-opacity` | `line-color` | `line-width`
 * @param defaultValue - the default value of if the feature is not hovered over or selected
 * @param isEqualToHovered - mapboxgl expression that checks if the feature is hovered over
 * @param valueWhenHovered - the value of the paint property when the feature is hovered over
 * @param isEqualToSelected - mapboxgl expression that checks if the feature is selected
 * @param valueWhenSelected - the value of the paint property when the feature is selected
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    COLOR_ROUTE_DEFAULT,
    COLOR_ROUTE_SELECTED,
    COLOR_STOP_DEFAULT,
    COLOR_STOP_SELECTED,
    LINE_WIDTH_DEFAULT,
    LINE_WIDTH_SELECTED,
    RADIUS_STOP_DEFAULT,
    RADIUS_STOP_SELECTED,
    STROKE_COLOR_STOP_DEFAULT,
    STROKE_COLOR_STOP_SELECTED,
    STROKE_WIDTH_STOP_DEFAULT,
    STROKE_WIDTH_STOP_SELECTED,
} from '../data/layerPaints';

export const updateLayerPaint = (
    map: mapboxgl.Map | null,
    layerID: string,
    property: string,
    defaultValue: any, // string | number or mapbox expression
    isEqualToHovered?: any,
    valueWhenHovered?: string | number,
    isEqualToSelected?: any,
    valueWhenSelected?: string | number,
) => {
    if (!map) return;
    // when there are route selected and hovered over
    if (isEqualToSelected && isEqualToHovered) {
        map.setPaintProperty(layerID, property, [
            'case',
            isEqualToHovered,
            valueWhenHovered,
            isEqualToSelected,
            valueWhenSelected,
            defaultValue,
        ]);
    }
    // when there are only hovered over routes and no selected ones
    else if (isEqualToHovered) {
        map.setPaintProperty(layerID, property, ['case', isEqualToHovered, valueWhenHovered, defaultValue]);
    }
    // when there are only selected routes
    else if (isEqualToSelected) {
        map.setPaintProperty(layerID, property, ['case', isEqualToSelected, valueWhenSelected, defaultValue]);
    } else {
        map.setPaintProperty(layerID, property, defaultValue);
    }
};

export const stopsPaintWhenSelected = (map: mapboxgl.Map, selectedStopID: string) => {
    const isEqualToSelected = ['==', ['get', 'stopId'], selectedStopID];
    updateLayerPaint(
        map,
        'ptStops',
        'circle-color',
        COLOR_STOP_DEFAULT,
        undefined,
        undefined,
        isEqualToSelected,
        COLOR_STOP_SELECTED,
    );
    updateLayerPaint(
        map,
        'ptStops',
        'circle-stroke-color',
        STROKE_COLOR_STOP_DEFAULT,
        undefined,
        undefined,
        isEqualToSelected,
        STROKE_COLOR_STOP_SELECTED,
    );
    updateLayerPaint(
        map,
        'ptStops',
        'circle-stroke-width',
        STROKE_WIDTH_STOP_DEFAULT,
        undefined,
        undefined,
        isEqualToSelected,
        STROKE_WIDTH_STOP_SELECTED,
    );
    updateLayerPaint(
        map,
        'ptStops',
        'circle-radius',
        RADIUS_STOP_DEFAULT,
        undefined,
        undefined,
        isEqualToSelected,
        RADIUS_STOP_SELECTED,
    );
};

export const routesPaintWhenSelected = (map: mapboxgl.Map, selectedRouteID: string) => {
    const isEqualToSelected = ['==', ['to-string', ['get', 'shape_id']], selectedRouteID];
    updateLayerPaint(
        map,
        'ptRoutes',
        'line-color',
        COLOR_ROUTE_DEFAULT,
        undefined,
        undefined,
        isEqualToSelected,
        COLOR_ROUTE_SELECTED,
    );
    updateLayerPaint(
        map,
        'ptRoutes',
        'line-width',
        LINE_WIDTH_DEFAULT,
        undefined,
        undefined,
        isEqualToSelected,
        LINE_WIDTH_SELECTED,
    );
};

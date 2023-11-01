/**
 * Updates paint properties of a layer based on a selected feature
 * @param map - the mapboxgl map
 * @param layerID - the layer that the mouse is hovering over
 * @param property `color` | `width` | `fill-color` | `fill-opacity` | `line-color` | `line-width
 * @param isEqualToSelected - mapboxgl expression that checks if the feature is selected
 * @param valueWhenSelected - the value that the feature should have when selected
 * @param valueWhenUnselected - the default value of the paint property when the feature is unselected
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateSelectedPaint = (
    map: mapboxgl.Map | null,
    layerID: string,
    property: string,
    isEqualToSelected: any,
    valueWhenSelected: string | number,
    valueWhenUnselected: string | number,
) => {
    if (map) {
        map.setPaintProperty(layerID, property, ['case', isEqualToSelected, valueWhenSelected, valueWhenUnselected]);
    }
};

/**
 * Updates paint properties of a layer based on a hovered feature
 * @param map - the mapboxgl map
 * @param layerID - the layer that the mouse is hovering over
 * @param property `color` | `width` | `fill-color` | `fill-opacity` | `line-color` | `line-width`
 * @param isEqualToHovered - mapboxgl expression that checks if the feature is hovered over
 * @param valueWhenHovered - the value of the paint property when the feature is hovered over
 * @param defaultValue - the default value of if the feature is not hovered over or selected
 * @param isEqualToSelected - mapboxgl expression that checks if the feature is selected
 * @param valueWhenSelected - the value of the paint property when the feature is selected
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateHoveredPaint = (
    map: mapboxgl.Map | null,
    layerID: string,
    property: string,
    isEqualToHovered: any,
    valueWhenHovered: string | number,
    defaultValue: string | number,
    isEqualToSelected?: any,
    valueWhenSelected?: string | number,
) => {
    if (!map) return;
    if (isEqualToSelected) {
        map.setPaintProperty(layerID, property, [
            'case',
            isEqualToHovered,
            valueWhenHovered,
            isEqualToSelected,
            valueWhenSelected,
            defaultValue,
        ]);
    } else {
        map.setPaintProperty(layerID, property, ['case', isEqualToHovered, valueWhenHovered, defaultValue]);
    }
};

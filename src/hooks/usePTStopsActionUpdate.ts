import {
    COLOR_STOP_DEFAULT,
    COLOR_STOP_HOVERED,
    COLOR_STOP_SELECTED,
    RADIUS_STOP_DEFAULT,
    RADIUS_STOP_HOVERED,
    RADIUS_STOP_SELECTED,
    STROKE_COLOR_STOP_DEFAULT,
    STROKE_WIDTH_STOP_DEFAULT,
} from '../data/layerPaints';
import { updateSelectedStop } from '../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../store';
import { stopsPaintWhenSelected, updateLayerPaint } from './useHookUtil';

/*
 * Update the map when a stop is clicked or hovered.
 */
export const usePTStopsActionUpdate = (map: mapboxgl.Map | null): void => {
    const dispatch = useAppDispatch();
    const selectedStopID = useAppSelector((state) => state.slice.selectedStop);

    if (map) {
        // This function is called whenever a stop is clicked on the map.
        map.on('click', 'ptStops', (e) => {
            if (e.features) {
                const temp = e.features[0].properties;
                if (temp) {
                    dispatch(updateSelectedStop('' + temp.stopId));
                }
            }
        });
        map.on('mouseenter', 'ptStops', (e) => handleStopMouseEnter(map, e, selectedStopID));
        map.on('mouseleave', 'ptStops', () => handleStopMouseLeave(map, selectedStopID));
    }
};

// This function is called whenever a stop is hovered on the map.
const handleStopMouseEnter = (map: mapboxgl.Map, e: mapboxgl.MapLayerMouseEvent, selectedStopID: string) => {
    map.getCanvas().style.cursor = 'pointer';
    if (e.features) {
        const temp = e.features[0].properties;
        if (temp) {
            const hoveredStopID = temp.stopId;
            const isEqualToHovered = ['==', ['to-string', ['get', 'stopId']], hoveredStopID];
            if (selectedStopID !== '') {
                const isEqualToSelected = ['==', ['to-string', ['get', 'stopId']], selectedStopID];
                updateLayerPaint(
                    map,
                    'ptStops',
                    'circle-color',
                    COLOR_STOP_DEFAULT,
                    isEqualToHovered,
                    COLOR_STOP_HOVERED,
                    isEqualToSelected,
                    COLOR_STOP_SELECTED,
                );
                updateLayerPaint(
                    map,
                    'ptStops',
                    'circle-radius',
                    RADIUS_STOP_DEFAULT,
                    isEqualToHovered,
                    RADIUS_STOP_HOVERED,
                    isEqualToSelected,
                    RADIUS_STOP_SELECTED,
                );
            } else {
                updateLayerPaint(
                    map,
                    'ptStops',
                    'circle-color',
                    COLOR_STOP_DEFAULT,
                    isEqualToHovered,
                    COLOR_STOP_HOVERED,
                );
                updateLayerPaint(
                    map,
                    'ptStops',
                    'circle-radius',
                    RADIUS_STOP_DEFAULT,
                    isEqualToHovered,
                    RADIUS_STOP_HOVERED,
                );
            }
        }
    }
};
// This function is called whenever the mouse leaves a stop.
const handleStopMouseLeave = (map: mapboxgl.Map, selectedStopID: string) => {
    if (selectedStopID) {
        stopsPaintWhenSelected(map, selectedStopID);
    } else {
        updateLayerPaint(map, 'ptStops', 'circle-color', COLOR_STOP_DEFAULT);
        updateLayerPaint(map, 'ptStops', 'circle-stroke-color', STROKE_COLOR_STOP_DEFAULT);
        updateLayerPaint(map, 'ptStops', 'circle-stroke-width', STROKE_WIDTH_STOP_DEFAULT);
        updateLayerPaint(map, 'ptStops', 'circle-radius', RADIUS_STOP_DEFAULT);
    }
    map.getCanvas().style.cursor = '';
};

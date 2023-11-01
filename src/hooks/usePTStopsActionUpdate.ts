import { updateSelectedStop } from '../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../store';
import { updateHoveredPaint } from './useHookUtil';

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
        map.on('mouseleave', 'ptStops', () => handleStopMouseLeave(map));
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
                updateHoveredPaint(
                    map,
                    'ptStops',
                    'circle-color',
                    isEqualToHovered,
                    'orange',
                    'yellow',
                    isEqualToSelected,
                    'orange',
                );
                updateHoveredPaint(map, 'ptStops', 'circle-radius', isEqualToHovered, 10, 5, isEqualToSelected, 8);
            } else {
                updateHoveredPaint(map, 'ptStops', 'circle-color', isEqualToHovered, 'orange', 'yellow');
                updateHoveredPaint(map, 'ptStops', 'circle-radius', isEqualToHovered, 10, 5);
            }
        }
    }
};
// This function is called whenever the mouse leaves a stop.
const handleStopMouseLeave = (map: mapboxgl.Map) => {
    map.getCanvas().style.cursor = '';
};

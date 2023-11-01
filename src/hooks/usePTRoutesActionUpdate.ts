import { updateSelectedRoute } from '../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../store';
import { updateHoveredPaint } from './useHookUtil';

/*
 * Update the map when a route is clicked or hovered.
 */
export const usePTRoutesActionUpdate = (map: mapboxgl.Map | null): void => {
    const selectedRouteID = useAppSelector((state) => state.slice.selectedRoute);

    const dispatch = useAppDispatch();

    if (map) {
        // This function is called whenever a route is clicked on the map.
        map.on('click', 'ptRoutes', (e) => {
            if (e.features) {
                const temp = e.features[0].properties;
                if (temp) {
                    dispatch(updateSelectedRoute('' + temp.shape_id));
                }
            }
        });
        map.on('mouseenter', 'ptRoutes', (e) => handleRouteMouseEnter(map, e, selectedRouteID));
        map.on('mouseleave', 'ptRoutes', () => handleRouteMouseLeave(map));
    }
};

// This function is called whenever the mouse hovers on a route.
const handleRouteMouseEnter = (map: mapboxgl.Map, e: mapboxgl.MapLayerMouseEvent, selectedRouteID: string) => {
    map.getCanvas().style.cursor = 'pointer';
    if (e.features) {
        const temp = e.features[0].properties;
        if (temp) {
            const shapeID = '' + temp.shape_id;

            const isEqualToHovered = ['==', ['to-string', ['get', 'shape_id']], shapeID];
            if (selectedRouteID !== '') {
                const isEqualToSelected = ['==', ['to-string', ['get', 'shape_id']], selectedRouteID];
                updateHoveredPaint(
                    map,
                    'ptRoutes',
                    'line-color',
                    isEqualToHovered,
                    'orange',
                    'purple',
                    isEqualToSelected,
                    'red',
                );
                updateHoveredPaint(map, 'ptRoutes', 'line-width', isEqualToHovered, 7, 1, isEqualToSelected, 5);
            } else {
                updateHoveredPaint(map, 'ptRoutes', 'line-color', isEqualToHovered, 'orange', 'purple');
                updateHoveredPaint(map, 'ptRoutes', 'line-width', isEqualToHovered, 5, 1);
            }
        }
    }
};

// This function is called whenever the mouse leaves a route.
const handleRouteMouseLeave = (map: mapboxgl.Map) => {
    map.getCanvas().style.cursor = '';
};

/**
 * Changes the pointer style to tell the user that an element is clickable.
 * @param layer clickable layer
 * @param map
 */
export const changeMousePointers = (layer: string, map: mapboxgl.Map): void => {
    //next two listeners change the pointer style
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map.on('mouseenter', layer, function (_) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map.on('mouseleave', layer, function (_) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = '';
    });
};

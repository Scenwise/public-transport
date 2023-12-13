import { useEffect } from 'react';

import {
    COLOR_ROUTE_DEFAULT,
    COLOR_ROUTE_HOVERED,
    COLOR_ROUTE_SELECTED,
    LINE_WIDTH_DEFAULT,
    LINE_WIDTH_HOVERED,
    LINE_WIDTH_SELECTED,
} from '../../data/layerPaints';
import { updateSelectedRoute } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { routesPaintWhenSelected, updateLayerPaint } from '../useHookUtil';

/*
 * Update the map when a route is clicked or hovered.
 */
export const usePTRoutesActionUpdate = (map: mapboxgl.Map | null): void => {
    const dispatch = useAppDispatch();

    const selectedRouteID = useAppSelector((state) => state.slice.selectedRoute);
    const clickableLayers = useAppSelector((state) => state.slice.clickableLayers);

    useEffect(() => {
        if (!map || !clickableLayers.includes('Routes')) return;
        // The layer listeners
        const clickLister = (e: mapboxgl.MapLayerMouseEvent) => {
            if (e.features) {
                const temp = e.features[0].properties;
                if (temp) {
                    dispatch(updateSelectedRoute('' + temp.shape_id));
                }
            }
        };
        const mouseEnterLister = (e: mapboxgl.MapLayerMouseEvent) => handleRouteMouseEnter(map, e, selectedRouteID);
        const mouseLeaveLister = () => handleRouteMouseLeave(map, selectedRouteID);

        // This function is called whenever a route is clicked on the map.
        map.on('click', 'ptRoutes', clickLister);
        map.on('mouseenter', 'ptRoutes', mouseEnterLister);
        map.on('mouseleave', 'ptRoutes', mouseLeaveLister);

        return () => {
            map.off('click', 'ptRoutes', clickLister);
            map.off('mouseenter', 'ptRoutes', mouseEnterLister);
            map.off('mouseleave', 'ptRoutes', mouseLeaveLister);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickableLayers]);
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
                updateLayerPaint(
                    map,
                    'ptRoutes',
                    'line-color',
                    COLOR_ROUTE_DEFAULT,
                    isEqualToHovered,
                    COLOR_ROUTE_HOVERED,
                    isEqualToSelected,
                    COLOR_ROUTE_SELECTED,
                );
                updateLayerPaint(
                    map,
                    'ptRoutes',
                    'line-width',
                    LINE_WIDTH_DEFAULT,
                    isEqualToHovered,
                    LINE_WIDTH_HOVERED,
                    isEqualToSelected,
                    LINE_WIDTH_SELECTED,
                );
            } else {
                updateLayerPaint(
                    map,
                    'ptRoutes',
                    'line-color',
                    COLOR_ROUTE_DEFAULT,
                    isEqualToHovered,
                    COLOR_ROUTE_HOVERED,
                );
                updateLayerPaint(
                    map,
                    'ptRoutes',
                    'line-width',
                    LINE_WIDTH_DEFAULT,
                    isEqualToHovered,
                    LINE_WIDTH_SELECTED,
                );
            }
        }
    }
};

// This function is called whenever the mouse leaves a route.
const handleRouteMouseLeave = (map: mapboxgl.Map, selectedRouteID: string) => {
    if (selectedRouteID !== '') {
        routesPaintWhenSelected(map, selectedRouteID);
    } else {
        updateLayerPaint(map, 'ptRoutes', 'line-color', COLOR_ROUTE_DEFAULT);
        updateLayerPaint(map, 'ptRoutes', 'line-width', LINE_WIDTH_DEFAULT);
    }
    map.getCanvas().style.cursor = '';
};

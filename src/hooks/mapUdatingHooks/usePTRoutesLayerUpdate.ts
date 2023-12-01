import { LngLatBounds } from 'mapbox-gl';
import { useEffect } from 'react';

import { useAppSelector } from '../../store';
import { routesPaintWhenSelected } from '../useHookUtil';

/*
 * This hook is used to update the mapbox map with the routes layer when the selected route changes.
 */
export const usePTRoutesLayerUpdate = (map: mapboxgl.Map | null): void => {
    const selectedPTRouteID = useAppSelector((state) => state.slice.selectedRoute);
    const ptRoutes = useAppSelector((state) => state.slice.ptRoutes);

    // Fly to selected route + set the paint of the selected route different
    useEffect((): void => {
        const selectedPTRoute = ptRoutes[selectedPTRouteID];

        if (map && selectedPTRoute) {
            // Get the bounds of the selected route geometry
            const bounds: LngLatBounds = selectedPTRoute.geometry.coordinates.reduce(
                (bounds, coord) => bounds.extend([coord[0], coord[1]]),
                new LngLatBounds(),
            );
            // Fly to the route bounds
            map.fitBounds(bounds, {
                padding: 20, // add padding in pixels
                maxZoom: 12, // max zoom to preserve padding
            });

            if (map.getLayer('ptStops')) {
                const selectedStopIDs = selectedPTRoute.properties.stops_ids;
                // Display the stops of the selected route
                map.setFilter('ptStops', ['in', ['get', 'stopId'], ['literal', selectedStopIDs]]);

                // Update the paint properties of the selected route
                routesPaintWhenSelected(map, selectedPTRouteID);
            }
        }
        // If the selected route is removed, move its corresponding stops
        if (map && !selectedPTRoute && map.getLayer('ptStops')) {
            // Display the stops of the selected route
            map.setFilter('ptStops', ['in', ['get', 'stopId'], ['literal', []]]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPTRouteID]);

    // Apply current filter to routes
    const filteredRoutes = useAppSelector((state) => state.slice.filteredRoutes);
    useEffect(() => {
        if (map && map.getLayer('ptRoutes')) {
            const filteredRouteIDs = filteredRoutes.map((route) => route.properties.shape_id);

            map.setFilter('ptRoutes', ['in', ['get', 'shape_id'], ['literal', filteredRouteIDs]]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredRoutes]);

    // Apply the selected route offset to routes
    const routeOffset = useAppSelector((state) => state.slice.routeOffset);
    useEffect(() => {
        if (map && map.getLayer('ptRoutes')) {
            map.setPaintProperty('ptRoutes', 'line-offset', routeOffset);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routeOffset]);
};

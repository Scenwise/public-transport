import { LngLatBounds } from 'mapbox-gl';
import { useEffect } from 'react';

import { useVehicleMarkers } from '../../components/Vehicles/VehicleMapContext';
import { useAppSelector } from '../../store';
import { routesPaintWhenSelected } from '../useHookUtil';

/*
 * This hook is used to update the mapbox map with the routes layer when the selected route changes.
 */
export const usePTRoutesLayerUpdate = (map: mapboxgl.Map | null): void => {
    const selectedPTRouteID = useAppSelector((state) => state.slice.selectedRoute);
    const ptRoutes = useAppSelector((state) => state.slice.ptRoutes);

    // TODO: This is a temporary solution to get the vehicle markers from the context. They should be stored in the state eventually.
    const context = useVehicleMarkers();
    const vehicleMarkers = context.vehicleMarkers;

    // Fly to selected route + set the paint of the selected route different
    useEffect((): void => {
        const selectedPTRoute = ptRoutes[selectedPTRouteID];
        if (map && selectedPTRoute) {
            // If there are vehicles on the selected route, jump to the first vehicle on the route
            // Otherwise, jump to the center of the route
            if (selectedPTRoute.properties.vehicle_ids.length > 0) {
                // TODO: Currently there is no way to get the selected vehicle so the map will fly to the first vehicle of the selected route
                // TODO: When the selected vehicle id is stored in the state, this can be used to fly to the selected vehicle
                const marker = vehicleMarkers.get(selectedPTRoute.properties.vehicle_ids[0]);
                if (marker) {
                    map.flyTo({
                        center: marker.marker.getLngLat(),
                        zoom: 13,
                    });
                }
            } else {
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
            }

            // Only display the stops of the selected route
            if (map.getLayer('ptStops')) {
                const selectedStopIDs = selectedPTRoute.properties.stops_ids;
                map.setFilter('ptStops', ['in', ['get', 'stopId'], ['literal', selectedStopIDs]]);
            }

            // Only display the direction of the selected route
            if (map.getLayer('selectedRouteDirection')) {
                map.setFilter('selectedRouteDirection', [
                    '==',
                    ['to-string', ['get', 'shape_id']],
                    '' + selectedPTRoute.properties.shape_id,
                ]);
            }

            // Update the paint properties of the selected route
            routesPaintWhenSelected(map, selectedPTRouteID);
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

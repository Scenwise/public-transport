import { LngLatBounds } from 'mapbox-gl';
import { useEffect } from 'react';

import { useVehicleMarkers } from '../../components/Vehicles/VehicleMapContext';
import { useAppSelector } from '../../store';
import { routesPaintWhenSelected } from '../useHookUtil';

// technique based on https://jsfiddle.net/2mws8y3q/
// an array of valid line-dasharray values, specifying the lengths of the alternating dashes and gaps that form the dash pattern
const dashArraySequence = [
    [0, 4, 3],
    [1, 4, 2],
    [2, 4, 1],
    [3, 4, 0],
    [0, 1, 3, 3],
    [0, 2, 3, 2],
    [0, 3, 3, 1],
];

const useAnimateSelectedRoute = (map: mapboxgl.Map | null) => {
    useEffect(() => {
        let step = 0;
        function animateDashArray(timestamp: number) {
            if (map && map.getLayer('selectedRouteDirection')) {
                // Update line-dasharray using the next value in dashArraySequence. The
                // divisor in the expression `timestamp / 50` controls the animation speed.
                const newStep = parseInt(String((timestamp / 50) % dashArraySequence.length));

                if (newStep !== step) {
                    map.setPaintProperty('selectedRouteDirection', 'line-dasharray', dashArraySequence[step]);
                    step = newStep;
                }

                // Request the next frame of the animation.
                requestAnimationFrame(animateDashArray);
            }
        }

        // start the animation
        animateDashArray(0);
    }, [map]);
};

/*
 * This hook is used to update the mapbox map with the routes layer when the selected route changes.
 */
export const usePTRoutesLayerUpdate = (map: mapboxgl.Map | null): void => {
    const selectedPTRouteID = useAppSelector((state) => state.slice.selectedRoute);
    const ptRoutes = useAppSelector((state) => state.slice.ptRoutes);

    useAnimateSelectedRoute(map);

    // TODO: This is a temporary solution to get the vehicle markers from the context. They should be stored in the state eventually.
    const context = useVehicleMarkers();
    const vehicleMarkers = context.vehicleMarkers;

    const selectedVehicleID = useAppSelector((state) => state.slice.selectedVehicle);

    // Fly to selected route + set the paint of the selected route different
    useEffect((): void => {
        const selectedPTRoute = ptRoutes[selectedPTRouteID];
        if (map && selectedPTRoute) {
            // If there are vehicles on the selected route, jump to the selected vehicle
            // Otherwise, jump to the center of the route
            if (selectedPTRoute.properties.vehicle_ids.length > 0) {
                const marker = vehicleMarkers.get(selectedVehicleID);
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
        if (map && map.getLayer('ptRoutes') && map.getLayer('selectedRouteDirection')) {
            map.setPaintProperty('ptRoutes', 'line-offset', routeOffset);
            map.setPaintProperty('selectedRouteDirection', 'line-offset', routeOffset);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routeOffset]);
};

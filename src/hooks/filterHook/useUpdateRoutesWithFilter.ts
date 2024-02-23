import mapboxgl from 'mapbox-gl';
import React, { useEffect } from 'react';

import {
    selectPTRoutesFeatureList,
    updateFilteredRoutes,
    updateSelectedRoute,
    updateSelectedStop,
    updateVisibleRouteState,
} from '../../dataStoring/slice';
import { checkFilteredRoute } from '../../methods/filter/filteredRouteUtilities';
import { useAppDispatch, useAppSelector } from '../../store';
import { getVisibleRoutes } from './useVisibleRoutesUpdate';

// Keep dynamic global variables so we can access them inside the websocket
export let mutableFilters = {} as Filters;

export const useUpdateRoutesWithFilter = (
    map: mapboxgl.Map | null,
    setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | null>>,
    vehicleMarkers: Map<string, VehicleRoutePair>,
) => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.slice.filters);
    const routes = useAppSelector(selectPTRoutesFeatureList);
    const stops = useAppSelector((state) => state.slice.ptStops);
    const selectedPTRouteID = useAppSelector((state) => state.slice.selectedRoute);

    // If the filter is changed, we need to update the routes.
    // eslint-disable-next-line sonarjs/cognitive-complexity
    useEffect(() => {
        const filteredRoutes = routes.filter((route) => checkFilteredRoute(route, filters, stops, vehicleMarkers));

        // If the selected route is not in the filtered routes, remove the selected route and stop.
        if (!filteredRoutes.map((route) => '' + route.properties.shape_id).includes(selectedPTRouteID)) {
            // Remove the selected route and stop when the filter is changed.
            dispatch(updateSelectedRoute(''));
            dispatch(updateSelectedStop(''));
        }

        dispatch(updateFilteredRoutes(filteredRoutes));

        // Filter out the vehicles and make sure only those with larger delay are added
        const newFilteredIds = new Set(filteredRoutes.map((route) => route.properties.shape_id + ''));
        if (map) {
            vehicleMarkers.forEach((value) => {
                value.marker.remove();
                if (
                    newFilteredIds.has(value.routeId) &&
                    (filters['delay'].value == -1 ||
                        value.vehicle.properties.punctuality >= filters['delay'].value * 60)
                ) {
                    value.marker.addTo(map);
                }
            });
        }
        // Keep updated filters in mutable structure
        mutableFilters = filters;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const visibleRoutes = useAppSelector((state) => state.slice.visibleRoutes);

    // Update the visible routes when map is moved.
    useEffect(() => {
        if (!map || !visibleRoutes.isOn) return;
        const listener = () => {
            setMap(newMap);
            const updatedVisibleFiltering = getVisibleRoutes(map, visibleRoutes);
            dispatch(updateVisibleRouteState(updatedVisibleFiltering));
        };

        const newMap = map.on('moveend', listener);

        return () => {
            map.off('moveend', listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, dispatch, visibleRoutes]);
};

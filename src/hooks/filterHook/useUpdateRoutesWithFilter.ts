import mapboxgl from 'mapbox-gl';
import React, { useEffect } from 'react';

import { filteredRouteIds, mutableCurrentDelay } from '../../data/data';
import {
    selectPTRoutesFeatureList,
    updateFilteredRoutes,
    updateSelectedRoute,
    updateSelectedStop,
    updateVisibleRouteState,
} from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { getVisibleRoutes } from './useVisibleRoutesUpdate';

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
        const filteredRoutes = routes.filter((route) => {
            let isRouteKept = true;
            Object.entries(filters).forEach(([key, filter]) => {
                if (key == 'stop') {
                    isRouteKept =
                        isRouteKept &&
                        checkCheckboxFilterList(
                            filter,
                            route.properties.stops_ids.map((id) => stops[id].properties.stopName),
                        );
                } else if (key == 'delay' && filter.value != -1) {
                    // We only filter based on delay if the value of the filter is not initial value
                    isRouteKept =
                        isRouteKept && checkVehicleDelayPerRoute(filter, route.properties.vehicle_ids, vehicleMarkers);
                } else {
                    isRouteKept = isRouteKept && checkCheckboxFilter(filter, route.properties[key]);
                }
            });
            return isRouteKept;
        });

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
            // Keep updated delay in mutable structure
            mutableCurrentDelay.pop();
            mutableCurrentDelay.push(filters['delay'].value);
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
        // Keep updated filtered ids in mutable structure
        filteredRouteIds.clear();
        newFilteredIds.forEach((x) => filteredRouteIds.add(x));

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

/**
 * If the filter is a checkbox or subCheckbox type, determine if a value/property of an route should be filtered
 * @param filter The filter to apply
 * @param value The value to be checked if it is included after the filter is applied
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkCheckboxFilter = (filter: Filter, value: string): boolean => {
    return filter.variants.includes(value) || !filter.variants.length;
};

const checkCheckboxFilterList = (filter: Filter, valueList: string[]): boolean => {
    return !filter.variants.length || valueList.some((value) => filter.variants.includes(value));
};

const checkVehicleDelayPerRoute = (
    filter: Filter,
    vehicleIds: string[],
    vehicleMarkers: Map<string, VehicleRoutePair>,
): boolean => {
    for (const vehicle of vehicleIds) {
        const vehiclePunctuality = vehicleMarkers.get(vehicle)?.vehicle.properties.punctuality;
        // If we find one vehicle with corresponding delay, return true since we want to keep the route
        if (vehiclePunctuality !== undefined && vehiclePunctuality >= filter.value * 60) {
            return true;
        }
    }
    // If all vehicles are below the delay threshold, do not keep the route
    return false;
};

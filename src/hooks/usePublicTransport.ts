import mapboxgl from 'mapbox-gl';
import React, { useEffect } from 'react';

import { useVehicleMarkers } from '../components/Vehicles/VehicleMapContext';
import { ReadyState, filterKeys, filterNames } from '../data/data';
import {
    selectPTRoutesFeatureList,
    selectPTStopsFeatureList,
    updatePTRoutes,
    updatePTStops,
    updateStatus,
    updateStopCodeToRouteMap,
} from '../dataStoring/slice';
import { addPublicTransportData } from '../methods/apiRequests/addPublicTransportData';
import { useAppDispatch, useAppSelector } from '../store';
import { useInitiateFilterOptions } from './filterHook/useInitiateFilterOptions';
import { useUpdateRoutesWithFilter } from './filterHook/useUpdateRoutesWithFilter';
import { useVisibleRoutesUpdate } from './filterHook/useVisibleRoutesUpdate';
import { usePTRoutesActionUpdate } from './mapUpatingHooks/usePTRoutesActionUpdate';
import { usePTRoutesLayerUpdate } from './mapUpatingHooks/usePTRoutesLayerUpdate';
import { usePTStopsActionUpdate } from './mapUpatingHooks/usePTStopsActionUpdate';
import { usePTStopsLayerUpdate } from './mapUpatingHooks/usePTStopsLayerUpdate';
import { useUpdateMapStyle } from './mapUpatingHooks/useUpdateMapStyle';
import { useApplyDataToSource, useInitializeSourcesAndLayers } from './useInitializeSourcesAndLayers';
import { useKV6Websocket } from './vehicles/useKV6Websocket';
import { useVehicleScheduleMatch } from './vehicles/useVehicleScheduleMatch';

export const usePublicTransport = (
    map: mapboxgl.Map | null,
    setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | null>>,
): void => {
    const dispatch = useAppDispatch();
    // Initialize the routes and the stops
    const mapInitialized = useInitializeSourcesAndLayers(map);

    const ptRouteFeatures = useAppSelector(selectPTRoutesFeatureList);
    const ptStopFeatures = useAppSelector(selectPTStopsFeatureList);

    // Fetch the data from the api and store them
    // Update the filter options
    useEffect(() => {
        if (map && mapInitialized.current) {
            const fetchData = async () => {
                dispatch(updateStatus({ ptRoute: ReadyState.CONNECTING, ptStop: ReadyState.CONNECTING }));

                await addPublicTransportData(
                    (routes: FeatureRecord<PTRouteFeature>) => {
                        dispatch(updatePTRoutes(routes));
                    },
                    (stops: FeatureRecord<PTStopFeature>) => {
                        dispatch(updatePTStops(stops));
                    },
                    (stopsToRoutes: Record<string, number>) => {
                        dispatch(updateStopCodeToRouteMap(stopsToRoutes));
                    },
                    (status: Status) => {
                        dispatch(updateStatus(status));
                    },
                );
            };
            fetchData();
        }
        /*eslint-disable react-hooks/exhaustive-deps*/
    }, [mapInitialized.current]);

    useInitiateFilterOptions(filterNames, filterKeys);

    // VehicleMarkers keys are of format: "[DataOwnerCode]-[VehicleNumber]"
    const context = useVehicleMarkers();
    const [vehicleMarkers, setVehicleMarkers] = [context.vehicleMarkers, context.setVehicleMarkers];

    useKV6Websocket(mapInitialized.current, map, vehicleMarkers, setVehicleMarkers);
    useVehicleScheduleMatch(vehicleMarkers);

    // Update the layers of the map when an action is triggered
    usePTRoutesActionUpdate(map);
    usePTStopsActionUpdate(map);

    // Update the layers of the map
    usePTRoutesLayerUpdate(map);
    usePTStopsLayerUpdate(map);

    // Update the style of the map
    useUpdateMapStyle(map, setMap);

    // Update the filtered list
    useUpdateRoutesWithFilter(map, setMap, vehicleMarkers);

    // Update the visible routes from the current map screen
    useVisibleRoutesUpdate(map);

    // Add the loaded source to the map
    useApplyDataToSource(mapInitialized.current, 'ptRoutes', ptRouteFeatures, map);
    useApplyDataToSource(mapInitialized.current, 'ptStops', ptStopFeatures, map);
};

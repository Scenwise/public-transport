import { useEffect } from 'react';

import { ReadyState } from '../data/data';
import {
    selectPTRoutesFeatureList,
    selectPTStopsFeatureList,
    updatePTRoutes,
    updatePTStops,
    updateStatus,
} from '../dataStoring/slice';
import { addPublicTransportData } from '../methods/apiRequests/addPublicTransportData';
import { useAppDispatch, useAppSelector } from '../store';
import { useInitiateFilterOptions } from './filterHook/useInitiateFilterOptions';
import { useUpdateRoutesWithFilter } from './filterHook/useUpdateRoutesWithFilter';
import { useVisibleRoutesUpdate } from './filterHook/useVisibleRoutesUpdate';
import { usePTRoutesActionUpdate } from './mapUdatingHooks/usePTRoutesActionUpdate';
import { usePTRoutesLayerUpdate } from './mapUdatingHooks/usePTRoutesLayerUpdate';
import { usePTStopsActionUpdate } from './mapUdatingHooks/usePTStopsActionUpdate';
import { usePTStopsLayerUpdate } from './mapUdatingHooks/usePTStopsLayerUpdate';
import { useUpdateMapStyle } from './mapUdatingHooks/useUpdateMapStyle';
import { useApplyDataToSource, useInitializeSourcesAndLayers } from './useInitializeSourcesAndLayers';

export const usePublicTransport = (map: mapboxgl.Map | null): void => {
    const dispatch = useAppDispatch();

    // Initialize the routes and the stops
    const mapInitialized = useInitializeSourcesAndLayers(map);

    const ptRouteFeatures = useAppSelector(selectPTRoutesFeatureList);
    const ptStopFeatures = useAppSelector(selectPTStopsFeatureList);

    // Fetch the data from the api and store them
    // Update the filter options
    useEffect(() => {
        if (mapInitialized.current) {
            const fetchData = async () => {
                dispatch(updateStatus({ ptRoute: ReadyState.CONNECTING, ptStop: ReadyState.CONNECTING }));

                await addPublicTransportData(
                    (routes: FeatureRecord<PTRouteFeature>) => {
                        dispatch(updatePTRoutes(routes));
                    },
                    (stops: FeatureRecord<PTStopFeature>) => {
                        dispatch(updatePTStops(stops));
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

    useInitiateFilterOptions(['Line Number', 'Vehicle Type', 'Agency'], ['line_number', 'vehicle_type', 'agency_id']);

    // Update the layers of the map when an action is triggered
    usePTRoutesActionUpdate(map);
    usePTStopsActionUpdate(map);

    // Update the layers of the map
    usePTRoutesLayerUpdate(map);
    usePTStopsLayerUpdate(map);

    // Update the style of the map
    useUpdateMapStyle(map);

    // Update the filtered list
    useUpdateRoutesWithFilter();

    // Update the visible routes from the current map screen
    useVisibleRoutesUpdate(map);

    // Add the loaded source to the map
    useApplyDataToSource(mapInitialized.current, 'ptRoutes', ptRouteFeatures, map);
    useApplyDataToSource(mapInitialized.current, 'ptStops', ptStopFeatures, map);
};

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { addPublicTransportData } from '../apiRequests/fetchData';
import { ReadyState } from '../data/data';
import {
    selectPTRoutesFeatureList,
    selectPTStopsFeatureList,
    updatePTRoutes,
    updatePTStops,
    updateStatus,
} from '../dataStoring/slice';
import { useAppDispatch } from '../store';
import { usePTRoutesActionUpdate } from './usePTRoutesActionUpdate';
import { useApplyDataToSource, useInitializeSourcesAndLayers, usePTRoutesLayerUpdate } from './usePTRoutesLayerUpdate';
import { usePTStopsActionUpdate } from './usePTStopsActionUpdate';
import { usePTStopsLayerUpdate } from './usePTStopsLayerUpdate';

export const usePublicTransport = (map: mapboxgl.Map | null): void => {
    const dispatch = useAppDispatch();

    // Initialize the routes and the stops
    const mapInitialized = useInitializeSourcesAndLayers(map);

    const ptRouteFeatures = useSelector(selectPTRoutesFeatureList);
    const ptStopFeatures = useSelector(selectPTStopsFeatureList);

    // Fetch the data from the api and store them
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

    // Update the layers of the map when an action is triggered
    usePTRoutesActionUpdate(map);
    usePTStopsActionUpdate(map);

    // Update the layers of the map
    usePTRoutesLayerUpdate(map);
    usePTStopsLayerUpdate(map);

    useEffect(() => {
        console.log(ptRouteFeatures);
        if (map) {
            console.log(map.getLayer('ptRoutes'));
            console.log(map.getSource('ptRoutesSource'));
        }
        /*eslint-disable react-hooks/exhaustive-deps*/
    }, [ptRouteFeatures]);

    // Add the loaded source to the map
    useApplyDataToSource(mapInitialized.current, 'ptRoutes', ptRouteFeatures, map);
    useApplyDataToSource(mapInitialized.current, 'ptStops', ptStopFeatures, map);
};

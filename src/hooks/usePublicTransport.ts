import { LngLatLike } from 'mapbox-gl';
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
import { useAppDispatch, useAppSelector } from '../store';
import { useApplyDataToSource, useInitializeSourcesAndLayers } from './usePTRoutesLayerUpdate';
import { usePopup } from './usePTRoutesPopup';

export const usePublicTransport = (map: mapboxgl.Map | null): void => {
    const dispatch = useAppDispatch();

    // Initialize the routes and the stops
    const mapInitialized = useInitializeSourcesAndLayers(map);

    const ptRouteFeatures = useSelector(selectPTRoutesFeatureList);
    const ptStopFeatures = useSelector(selectPTStopsFeatureList);

    useEffect(() => {
        console.log(mapInitialized.current);
    }, [mapInitialized.current]);
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
    }, [mapInitialized.current]);

    const selectedPTRouteID = useAppSelector((state) => state.slice.selectedRoute);
    const ptRoutes = useAppSelector((state) => state.slice.ptRoutes);

    // Add the public transport popup and the schedule.
    usePopup(map);

    // Fly to selected alert
    useEffect((): void => {
        const selectedPTRoute = ptRoutes[selectedPTRouteID];
        console.log(selectedPTRouteID);

        if (map && selectedPTRoute) {
            map.flyTo({ center: selectedPTRoute.geometry.coordinates[1] as LngLatLike, zoom: 10 });
            if (map.getLayer('ptStops')) {
                const selectedStopIDs = selectedPTRoute.properties.stops_ids;
                map.setFilter('ptStops', ['in', ['get', 'stopId'], ['literal', selectedStopIDs]]);
                map.setPaintProperty('ptRoutes', 'line-color', [
                    'case',
                    ['==', ['to-string', ['get', 'shape_id']], selectedPTRouteID],
                    'red',
                    'purple',
                ]);
                map.setPaintProperty('ptRoutes', 'line-width', [
                    'case',
                    ['==', ['to-string', ['get', 'shape_id']], selectedPTRouteID],
                    5,
                    1,
                ]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPTRouteID]);

    useEffect(() => {
        console.log(ptRouteFeatures);
        if (map) {
            console.log(map.getLayer('ptRoutes'));
            console.log(map.getSource('ptRoutesSource'));
        }
    }, [ptRouteFeatures]);

    // Add the loaded source to the map
    useApplyDataToSource(mapInitialized.current, 'ptRoutes', ptRouteFeatures, map);
    useApplyDataToSource(mapInitialized.current, 'ptStops', ptStopFeatures, map);
};

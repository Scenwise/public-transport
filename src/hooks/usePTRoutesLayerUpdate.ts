import { AnyLayer, GeoJSONSource, LngLatBounds } from 'mapbox-gl';
import { useEffect, useRef } from 'react';

import ptRoutesLayer from '../data/layers/ptRoutesLayer.json';
import ptStopsLayer from '../data/layers/ptStopsLayer.json';
import { useAppSelector } from '../store';
import { routesPaintWhenSelected } from './useHookUtil';

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

    const filteredRoutes = useAppSelector((state) => state.slice.filteredRoutes);
    useEffect(() => {
        if (map && map.getLayer('ptRoutes')) {
            const filteredRouteIDs = filteredRoutes.map((route) => route.properties.shape_id);

            map.setFilter('ptRoutes', ['in', ['get', 'shape_id'], ['literal', filteredRouteIDs]]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredRoutes]);
};

export const layerConfig: { [key: string]: AnyLayer } = {
    ptRoutes: ptRoutesLayer as AnyLayer,
    ptStops: ptStopsLayer as AnyLayer,
};
// export const useUpdatePTVehiclesLayer = (map: mapboxgl.Map): void => {};

/**
 * Initializes the sources and layers on the map.
 */
export const useInitializeSourcesAndLayers = (map: mapboxgl.Map | null): React.MutableRefObject<boolean> => {
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (map) {
            Object.entries(layerConfig).forEach(([layerId, layer]: [string, AnyLayer]) => {
                const sourceId = `${layerId}Source`;

                if (!map.getSource(sourceId)) {
                    map.addSource(sourceId, {
                        type: 'geojson',
                        data: { type: 'FeatureCollection', features: [] },
                    });

                    if (!map.getLayer(layer.id)) {
                        map.addLayer(layer);
                    }
                }
            });

            hasInitialized.current = true;
            console.log('generate layers');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    return hasInitialized;
};

// Custom local hook for applying data to a source when the data is updated.
export const useApplyDataToSource = <T extends GeoJSON.Feature>(
    mapInitialized: boolean,
    layerId: string,
    features: T[],
    map?: mapboxgl.Map | null,
): void => {
    useEffect((): void => {
        if (map && mapInitialized) {
            const source = map.getSource(`${layerId}Source`) as GeoJSONSource;
            if (source)
                source.setData({
                    type: 'FeatureCollection',
                    features: features,
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapInitialized, features]);
};

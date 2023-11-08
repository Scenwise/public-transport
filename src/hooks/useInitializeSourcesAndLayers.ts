import { AnyLayer, GeoJSONSource } from 'mapbox-gl';
import { useEffect, useRef } from 'react';

import ptRoutesLayer from '../data/layers/ptRoutesLayer.json';
import ptStopsLayer from '../data/layers/ptStopsLayer.json';

export const layerConfig: { [key: string]: AnyLayer } = {
    ptRoutes: ptRoutesLayer as AnyLayer,
    ptStops: ptStopsLayer as AnyLayer,
};

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

// Use to update the source and layer data when the map style is changed
export const updateSourcesAndLayers = <T extends GeoJSON.Feature>(
    layerId: string,
    features: T[],
    map?: mapboxgl.Map | null,
) => {
    if (map) {
        const sourceId = `${layerId}Source`;

        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: features },
            });
        }
        if (!map.getLayer(layerId)) {
            map.addLayer(layerConfig[layerId]);
        }
    }
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

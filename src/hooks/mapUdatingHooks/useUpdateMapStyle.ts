import mapboxgl from 'mapbox-gl';
import React, { useEffect } from 'react';

import { selectPTRoutesFeatureList, selectPTStopsFeatureList } from '../../dataStoring/slice';
import { useAppSelector } from '../../store';
import { updateSourcesAndLayers } from '../useInitializeSourcesAndLayers';

export const useUpdateMapStyle = (
    map: mapboxgl.Map | null,
    setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | null>>,
) => {
    const mapStyle = useAppSelector((state) => state.slice.mapStyle);

    useEffect(() => {
        if (map) {
            map.setStyle('mapbox://styles/mapbox/' + mapStyle);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapStyle]);

    const ptRouteFeatures = useAppSelector(selectPTRoutesFeatureList);
    const ptStopFeatures = useAppSelector(selectPTStopsFeatureList);

    // If the style is changed, reload the layers and the source
    useEffect(() => {
        if (!map) return;
        const listener = () => {
            setMap(newMap);
            updateSourcesAndLayers('ptRoutes', ptRouteFeatures, map);
            updateSourcesAndLayers('ptStops', ptStopFeatures, map);
        };

        const newMap = map.on('style.load', listener);

        return () => {
            map.off('style.load', listener);
        };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [map, ptRouteFeatures, ptStopFeatures]);
};

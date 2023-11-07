import { LngLatLike } from 'mapbox-gl';
import { useEffect } from 'react';

import { useAppSelector } from '../../store';
import { stopsPaintWhenSelected } from '../useHookUtil';

/*
 * This hook is used to update the stops layer in the map when the selected stop is changed.
 */
export const usePTStopsLayerUpdate = (map: mapboxgl.Map | null): void => {
    const selectedPTStopID = useAppSelector((state) => state.slice.selectedStop);
    const ptStops = useAppSelector((state) => state.slice.ptStops);

    useEffect(() => {
        const selectedPTStop = ptStops[selectedPTStopID];

        if (map && selectedPTStop) {
            // Unselected stop: yellow with radius 5, selected stop: orange with red border and radius 8
            map.flyTo({ center: selectedPTStop.geometry.coordinates as LngLatLike, zoom: 13 });
            stopsPaintWhenSelected(map, selectedPTStopID);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [selectedPTStopID]);
};

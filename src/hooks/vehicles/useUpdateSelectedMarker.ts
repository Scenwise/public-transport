import mapboxgl, { Marker } from 'mapbox-gl';
import { useEffect } from 'react';

import { COLOR_ROUTE_SELECTED } from '../../data/layerPaints';
import { updateSelectedRoute } from '../../dataStoring/slice';
import { getMarkerColor, setMarkerColor } from '../../methods/vehicles/vehicleMarkerUtilities';
import { useAppDispatch, useAppSelector } from '../../store';

// TODO: If the option of changing the clickability of the vehicles is going to be implemented, this will be useful
export const useUpdateSelectedMarker = (
    marker: Marker,
    selectedMarker: React.MutableRefObject<SelectedMarkerColor>,
    routeId: number,
    map: mapboxgl.Map,
): void => {
    const dispatch = useAppDispatch();
    const clickableLayers = useAppSelector((state) => state.slice.clickableLayers);

    useEffect(() => {
        if (!map || !clickableLayers.includes('Vehicles')) return;
        const markerElement = marker.getElement();
        const clickLister = () => {
            // Bring back previously selected marker to initial color
            if (selectedMarker.current.marker !== undefined) {
                setMarkerColor(selectedMarker.current.marker, selectedMarker.current.color);
            }

            // Set new marker as selected
            const oldColor = getMarkerColor(markerElement);
            selectedMarker.current = {
                color: oldColor,
                marker: marker,
            };

            map.flyTo({
                center: marker.getLngLat(),
                zoom: 13,
            });
            // Set new marker color as red
            setMarkerColor(marker, COLOR_ROUTE_SELECTED);

            dispatch(updateSelectedRoute(routeId + ''));
        };

        markerElement.addEventListener('click', clickLister);
        return () => {
            markerElement.removeEventListener('click', clickLister);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickableLayers]);
};

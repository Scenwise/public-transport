import { useEffect } from 'react';

import { useAppSelector } from '../../store';

export const useUpdateMapStyle = (map: mapboxgl.Map | null) => {
    const mapStyle = useAppSelector((state) => state.slice.mapStyle);

    useEffect(() => {
        if (map) {
            map.setStyle('mapbox://styles/mapbox/' + mapStyle);
        }
    }, [map, mapStyle]);
};

import { useEffect } from 'react';

import { useAppSelector } from '../../store';

export const useUpdateMapStyle = (map: mapboxgl.Map | null) => {
    const mapStyle = useAppSelector((state) => state.slice.mapStyle);
    useEffect(() => {
        if (map) {
            map.setStyle('mapbox://styles/mapbox/' + mapStyle);

            // if(map.getLayer('ptRoutes') && map.getLayer('ptStops')) {
            //     const ptRoutes = map.getLayer('ptRoutes');
            //     const ptStops = map.getLayer('ptStops');
            //
            //     map.removeLayer('ptRoutes');
            //     map.addLayer(ptRoutes);
            //     map.removeLayer('ptStops');
            //     map.addLayer(ptStops);
            //
            // }
        }
    }, [map, mapStyle]);
};

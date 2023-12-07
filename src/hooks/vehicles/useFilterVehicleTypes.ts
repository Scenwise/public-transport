import { useEffect } from 'react';

import { useVehicleMarkers } from '../../components/Vehicles/VehicleMapContext';
import { RootState, useAppSelector } from '../../store';

const useFilterVehicleTypes = (
    mapInitialized: boolean,
    map: mapboxgl.Map | null,
    vehicleMarkers: Map<string, VehicleRoutePair>,
): void => {
    const routesMap = useAppSelector((state: RootState) => state.slice.ptRoutes);
    const selectedVehicleTypes = useVehicleMarkers().vehicleFilters;
    useEffect(() => {
        if (mapInitialized && map) {
            vehicleMarkers.forEach((value) => {
                value.marker.remove();
                const route = routesMap[value.routeId];
                if (
                    selectedVehicleTypes.get(route.properties.route_type)?.checked ||
                    (selectedVehicleTypes.get('Other')?.checked && route.properties.route_type === '')
                ) {
                    value.marker.addTo(map);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVehicleTypes]);
};

export default useFilterVehicleTypes;

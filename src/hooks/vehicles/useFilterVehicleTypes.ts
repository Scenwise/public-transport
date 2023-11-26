import { useEffect } from 'react';

import { RootState, useAppSelector } from '../../store';

const useFilterVehicleTypes = (
    mapInitialized: boolean,
    map: mapboxgl.Map | null,
    vehicleMarkers: Map<string, VehicleRoutePair>,
): void => {
    const routesMap = useAppSelector((state: RootState) => state.slice.ptRoutes);
    const selectedVehicleTypes = useAppSelector((state: RootState) => state.slice.filteredVehicleTypes);
    useEffect(() => {
        if (mapInitialized && map) {
            const filteredTypes = new Array<string>();
            for (let i = 0; i < selectedVehicleTypes.length; i++) {
                if (selectedVehicleTypes[i].checked) {
                    filteredTypes.push(selectedVehicleTypes[i].name);
                }
            }

            vehicleMarkers.forEach((value) => {
                value.marker.remove();
                const route = routesMap[value.routeId];
                // We consider routes with no route type to be busses by default
                if (
                    filteredTypes.includes(route.properties.route_type) ||
                    (filteredTypes.includes('Other') && route.properties.route_type === '')
                ) {
                    value.marker.addTo(map);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVehicleTypes]);
};

export default useFilterVehicleTypes;

import React, { useMemo } from 'react';

import { updateSelectedRoute } from '../../dataStoring/slice';
import { filterRoutesByVisibleIds } from '../../hooks/filterHook/useVisibleRoutesUpdate';
import { useAppDispatch, useAppSelector } from '../../store';
import { GeneralTable } from './GeneralTable';

/*
 * This component is used to display the routes table.
 */
const RoutesTable: React.FC = () => {
    const dispatch = useAppDispatch();

    // Filter the routes.
    const filteredRoutes = useAppSelector((state) => state.slice.filteredRoutes).map((feature) => feature.properties);
    const visibleRoutes = useAppSelector((state) => state.slice.visibleRoutes);
    const filteredVisibleRoutes = filterRoutesByVisibleIds(visibleRoutes.isOn, visibleRoutes.ids, filteredRoutes);

    const headers = ['index', 'origin', 'destination', 'line number', 'agency', 'vehicle type', 'route id', 'shape id'];
    const tables = filteredVisibleRoutes.map((route, index) => [
        index + '',
        route.origin,
        route.destination,
        route.line_number,
        route.agency_id,
        route.vehicle_type,
        route.route_id + '',
        route.shape_id + '',
    ]);

    // Find the index of the selected route to highlight it in the table
    const selectedRouteID = useAppSelector((state) => state.slice.selectedRoute);

    const selectedRouteIndex = useMemo(() => {
        return filteredVisibleRoutes
            .map((route) => '' + route.shape_id)
            .findIndex((routeID) => routeID === selectedRouteID);
    }, [selectedRouteID, filteredVisibleRoutes]);

    if (filteredVisibleRoutes.length == 0) return null;

    return (
        <GeneralTable
            id={'routes-table'}
            headers={headers}
            tables={tables}
            updateSelectedFeature={(selectedRouteID) => dispatch(updateSelectedRoute(selectedRouteID))}
            selectedRowIndex={selectedRouteIndex}
            style={{
                height: 'calc(100vh - 64px)', // Fill remaining height
                width: '28%',
                float: 'left',
                resize: "horizontal",
                overflow: 'hidden'
            }}
        />
    );
};

export { RoutesTable };

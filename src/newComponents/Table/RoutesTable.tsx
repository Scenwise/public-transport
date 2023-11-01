import React, { useMemo } from 'react';

import { selectPTRoutesFeatureList, updateSelectedRoute } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { GeneralTable } from './GeneralTable';

/*
 * This component is used to display the routes table.
 */
const RoutesTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const ptRoutes = useAppSelector(selectPTRoutesFeatureList).map((feature) => feature.properties);

    const headers = ['index', 'origin', 'destination', 'line number', 'agency', 'vehicle type', 'route id', 'shape id'];
    const tables = ptRoutes.map((route, index) => [
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
    const ptRoutesFeatures = useAppSelector((state) => state.slice.ptRoutes);

    const selectedRouteIndex = useMemo(() => {
        return Object.keys(ptRoutesFeatures).findIndex((routeID) => routeID === selectedRouteID);
    }, [selectedRouteID, ptRoutesFeatures]);

    if (ptRoutes.length == 0) return null;
    return (
        <GeneralTable
            headers={headers}
            tables={tables}
            updateSelectedFeature={(selectedRouteID) => dispatch(updateSelectedRoute(selectedRouteID))}
            selectedRowIndex={selectedRouteIndex}
            style={{
                height: 'calc(100vh - 64px)', // Fill remaining height
                width: '28%',
                float: 'left',
            }}
        />
    );
};

export { RoutesTable };

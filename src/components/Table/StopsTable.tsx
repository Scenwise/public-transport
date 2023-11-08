import React from 'react';

import { updateSelectedStop } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { GeneralTable } from './GeneralTable';

/*
 * This component is used to display the stops of the selected route.
 */
const StopsTable: React.FC = () => {
    const dispatch = useAppDispatch();

    const ptRoutesFeatures = useAppSelector((state) => state.slice.ptRoutes);
    const ptStopsFeatures = useAppSelector((state) => state.slice.ptStops);
    const selectedRouteID = useAppSelector((state) => state.slice.selectedRoute);
    const selectedStopID = useAppSelector((state) => state.slice.selectedStop);

    // Get the table headers and content
    let ptRouteProperty = {} as PTRouteProperties;
    // The stops that belongs to the selected route
    let ptStopsProperty = [] as PTStopProperties[];
    if (selectedRouteID != '') {
        ptRouteProperty = ptRoutesFeatures[selectedRouteID].properties;
        ptStopsProperty = ptRouteProperty.stops_ids.map((id) => ptStopsFeatures[id].properties);
    }
    // If there are no stops, no table is displayed
    if (ptStopsProperty.length == 0) return null;

    const headers = ['index', 'stop name', 'stop id'];
    const tables = ptStopsProperty.map((stop, index) => [index + '', stop.stopName, stop.stopId]);

    // Find the index of the selected stop to highlight it in the table
    const selectedStopIndex = ptStopsProperty.findIndex((stop) => stop.stopId == selectedStopID);

    return (
        <>
            {selectedRouteID !== '' && (
                <GeneralTable
                    key={selectedRouteID}
                    headers={headers}
                    tables={tables}
                    updateSelectedFeature={(selectedStopID) => dispatch(updateSelectedStop(selectedStopID))}
                    selectedRowIndex={selectedStopIndex}
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: 'calc(100% - 28%)', // Remaining width
                        height: '25%',
                        float: 'right',
                    }}
                />
            )}
        </>
    );
};

export { StopsTable };

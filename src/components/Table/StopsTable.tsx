import React, { useEffect, useState } from 'react';

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

    const [routesTableWidth, setRoutesTableWidth] = useState<number>(28);

    useEffect(() => {
        const routesTable = document.getElementById('routes-table');
        if (!routesTable) return;

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // Get the updated offsetWidth
                    const updatedWidth = routesTable.offsetWidth;
                    // Do something with the updated width, like updating state or performing other actions
                    setRoutesTableWidth((updatedWidth / window.innerWidth) * 100);
                }
            }
        });

        // Define what attributes you want to observe
        observer.observe(routesTable, { attributes: true });

        // Cleanup function for when the component unmounts or changes
        return () => {
            // Disconnect the observer when the component unmounts
            observer.disconnect();
        };
    }, []); // Empty dependency array to run the effect once on mount

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

    const headers = ['index', 'stop name', 'platform code', 'wheelchair boarding', 'stop code', 'stop id'];
    const tables = ptStopsProperty.map((stop, index) => [
        index + '',
        stop.stopName,
        stop.platformCode,
        stop.wheelchairBoarding,
        stop.stopsCode,
        stop.stopId,
    ]);

    // Find the index of the selected stop to highlight it in the table
    const selectedStopIndex = ptStopsProperty.findIndex((stop) => stop.stopId == selectedStopID);

    return (
        <div id={'stops-table'}>
            {selectedRouteID !== '' && (
                <GeneralTable
                    key={selectedRouteID}
                    headers={headers}
                    tables={tables}
                    updateSelectedFeature={(selectedStopID) => dispatch(updateSelectedStop(selectedStopID))}
                    selectedRowIndex={selectedStopIndex}
                    id={selectedRouteID}
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: `calc(100% - ${routesTableWidth}%)`, // Remaining width
                        height: '25%',
                        float: 'right',
                    }}
                />
            )}
        </div>
    );
};

export { StopsTable };

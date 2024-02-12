import React, { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, Popover, Typography } from '@mui/material';

import { updatePTStop, updateSelectedStop } from '../../dataStoring/slice';
import { addSchedule } from '../../methods/apiRequests/addSchedule';
import { useAppDispatch, useAppSelector } from '../../store';
import { GeneralTable } from './GeneralTable';

/*
 * This component is used to display the stops of the selected route.
 * If there are vehicles on the route, each vehicle gets a different stop table (to display the different schedules)
 */
const StopsTable: React.FC = () => {
    const dispatch = useAppDispatch();

    const ptRoutesFeatures = useAppSelector((state) => state.slice.ptRoutes);
    const ptStopsFeatures = useAppSelector((state) => state.slice.ptStops);
    const selectedRouteID = useAppSelector((state) => state.slice.selectedRoute);
    const selectedStopID = useAppSelector((state) => state.slice.selectedStop);
    const selectedVehicleID = useAppSelector((state) => state.slice.selectedVehicle);

    // Adjust the stop table based on the route table width
    const [routesTableWidth, setRoutesTableWidth] = useState<number>(28);
    const routesTable = document.getElementById('routes-table');
    useEffect(() => {
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

        observer.observe(routesTable, { attributes: true });

        // Cleanup function for when the component unmounts or changes
        return () => {
            // Disconnect the observer when the component unmounts
            observer.disconnect();
        };
    }, [routesTable]);

    // Control the open and close of the routes popover
    const [routesPopoverAnchorEl, setRoutesPopoverAnchorEl] = useState<null | HTMLElement>(null);
    const openRoutesPopover = Boolean(routesPopoverAnchorEl);
    const handleRoutesPopoverClick = (event: React.MouseEvent<HTMLElement>) => {
        setRoutesPopoverAnchorEl(event.currentTarget);
    };
    const handleRoutesPopoverClose = () => {
        setRoutesPopoverAnchorEl(null);
    };
    function chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    // Get data for the table headers and content
    const ptRouteProperty = useMemo(() => {
        return selectedRouteID != '' ? ptRoutesFeatures[selectedRouteID].properties : ({} as PTRouteProperties);
        /*eslint-disable react-hooks/exhaustive-deps*/
    }, [selectedRouteID, selectedVehicleID]);

    const ptStopsProperties = useMemo(() => {
        if (selectedRouteID !== '') {
            // update the stop properties by adding the schedules
            addSchedule(
                ptRouteProperty.route_id + '',
                ptRouteProperty.origin,
                ptRouteProperty.vehicle_ids.indexOf(selectedVehicleID + ''),
                ptRouteProperty.stops_ids.map((id) => ptStopsFeatures[id]),
                (stop: PTStopFeature) => dispatch(updatePTStop(stop)),
            );
            return ptRouteProperty.stops_ids.map((id) => ptStopsFeatures[id].properties);
        } else {
            return [] as PTStopProperties[];
        }
        /*eslint-disable react-hooks/exhaustive-deps*/
    }, [selectedVehicleID, selectedRouteID, ptStopsFeatures]);

    // If there are no stops, no table is displayed
    if (ptStopsProperties.length === 0) return null;

    const headers = [
        'index',
        'stop name',
        'platform code',
        'wheelchair boarding',
        'stop code',
        'arrival',
        'departure',
        'routes',
        'stop id',
    ];
    const tables = ptStopsProperties.map((stop, index) => [
        index + '',
        stop.stopName,
        stop.platformCode,
        stop.wheelchairBoarding,
        stop.stopsCode,
        stop.arrivalTime + '',
        stop.departureTime + '',
        stop.routes.toString(),
        stop.stopId,
    ]);

    // Find the index of the selected stop to highlight it in the table
    const selectedStopIndex = ptStopsProperties.findIndex((stop) => stop.stopId === selectedStopID);

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
                    renderCell={(rowData, rowIndex, columnIndex) => {
                        if (columnIndex === 7) {
                            return (
                                <div>
                                    <Typography
                                        color='primary'
                                        onClick={handleRoutesPopoverClick}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Routes
                                    </Typography>
                                    <Popover
                                        open={openRoutesPopover}
                                        anchorEl={routesPopoverAnchorEl}
                                        onClose={handleRoutesPopoverClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <Card style={{ maxWidth: '400px' }}>
                                            {' '}
                                            {/* Adjust the max width according to your preference */}
                                            <CardContent style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {chunkArray(rowData[columnIndex].split(','), 5).map((chunk, index) => (
                                                    <div key={index} style={{ marginRight: '10px' }}>
                                                        {chunk.join(', ')}
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </Popover>
                                </div>
                            );
                        }
                        return rowData[columnIndex];
                    }}
                />
            )}
        </div>
    );
};

export { StopsTable };

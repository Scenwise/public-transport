import React, { useEffect, useRef } from 'react';

import { Box, Card, ListItem, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { updateSelectedRoute } from '../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../store';

interface RouteListItemPropType {
    route: PTRouteProperties;
}

const useStyles = makeStyles({
    routeListItem: {
        '&:hover': {
            backgroundColor: 'grey.200',
            cursor: 'pointer',
        },
    },
});

const RouteListItem: React.FC<RouteListItemPropType> = ({ route }) => {
    const dispatch = useAppDispatch();
    const selectedRouteID = useAppSelector((store) => store.slice.selectedRoute);
    const isSelected = selectedRouteID && '' + route.shape_id === selectedRouteID;
    const bColor = isSelected ? 'grey.200' : 'white';
    const classes = useStyles();

    const thisListItem = useRef<HTMLLIElement | null>(null); // Specify the expected DOM element type

    // const map = useAppSelector((store) => store.slice.map);
    // const ptRoutes = useAppSelector((state) => state.slice.ptRoutes);

    // Select the alert on the map when the item is clicked.
    const handleLocateClick = () => {
        dispatch(updateSelectedRoute('' + route.shape_id));
        // const selectedPTRouteID = '' + route.shape_id;
        // const selectedPTRoute = ptRoutes[selectedPTRouteID];
        // if (map && selectedPTRoute) {
        //     map.flyTo({ center: selectedPTRoute.geometry.coordinates[1] as LngLatLike, zoom: 10 });
        //     if (map.getLayer('ptStops')) {
        //         const selectedStopIDs = selectedPTRoute.properties.stops_ids;
        //         map.setFilter('ptStops', ['in', ['get', 'stopId'], ['literal', selectedStopIDs]]);
        //         map.setPaintProperty('ptRoutes', 'line-color', [
        //             'case',
        //             ['==', ['to-string', ['get', 'shape_id']], selectedPTRouteID],
        //             'red',
        //             'purple',
        //         ]);
        //         map.setPaintProperty('ptRoutes', 'line-width', [
        //             'case',
        //             ['==', ['to-string', ['get', 'shape_id']], selectedPTRouteID],
        //             5,
        //             1,
        //         ]);
        //     }
        // }
    };

    // Scroll to the selected alert
    useEffect(() => {
        // Make the next station be shown on the center of the scrollable schedule
        if (isSelected && thisListItem) {
            thisListItem.current?.scrollIntoView({ block: 'center' });
        }
        /*eslint-disable react-hooks/exhaustive-deps*/
    }, [selectedRouteID]);

    return (
        <ListItem className={classes.routeListItem}>
            <Card
                variant='outlined'
                onClick={() => handleLocateClick()}
                sx={{
                    paddingLeft: '10px',
                    width: '100%',
                    bgcolor: bColor,
                    display: 'flex',
                    '&:hover': {
                        backgroundColor: 'grey.200',
                    },
                }}
                className={classes.routeListItem}
            >
                <Box
                    ref={thisListItem}
                    style={{
                        width: '50vh',
                        whiteSpace: 'normal',
                        zoom: 0.75,
                    }}
                >
                    <Typography variant='body2'>{route.route_name}</Typography>
                    <Typography component='p' variant='caption' color='text.secondary'>
                        {'line number: ' + route.line_number}
                    </Typography>
                    <Typography component='p' variant='caption' color='text.secondary'>
                        {'vehicle type: ' + route.vehicle_type}
                    </Typography>
                </Box>
            </Card>
        </ListItem>
    );
};

export { RouteListItem };

import React from 'react';

import { SvgIconComponent } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PendingIcon from '@mui/icons-material/Pending';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SyncIcon from '@mui/icons-material/Sync';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    List,
    Stack,
    SvgIconTypeMap,
    Tooltip,
    Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { ReadyState } from '../data/data';
import { selectPTRoutesFeatureList } from '../dataStoring/slice';
import { useAppSelector } from '../store';
import { RouteListItem } from './RouteListItem';

const connectionStatus = (readyState: ReadyState) => {
    const statusMapping: Record<ReadyState, string> = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    };
    return statusMapping[readyState];
};

const useStyles = makeStyles({
    content: {
        justifyContent: 'center',
    },
});

const statusIcons: { [key in ReadyState]: [SvgIconComponent, SvgIconTypeMap['props']['color']] } = {
    [ReadyState.UNINSTANTIATED]: [RemoveCircleIcon, 'disabled'],
    [ReadyState.CONNECTING]: [PendingIcon, 'info'],
    [ReadyState.OPEN]: [SyncIcon, 'success'],
    [ReadyState.CLOSING]: [SyncDisabledIcon, 'info'],
    [ReadyState.CLOSED]: [SyncDisabledIcon, 'info'],
};

const RouteList: React.FC = () => {
    const ptRoutes = useAppSelector(selectPTRoutesFeatureList).map((feature) => feature.properties);

    const status = useAppSelector((state) => state.slice.status);

    const classes = useStyles();

    const getStatusIcon = (readystate: ReadyState): [SvgIconComponent, SvgIconTypeMap['props']['color']] => {
        return statusIcons[readystate];
    };
    const [PTRouteStatusIcon, ptRouteStatusColor] = getStatusIcon(status.ptRoute);

    return (
        <Box position='absolute'>
            <Accordion style={{ overflow: 'hidden' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ marginRight: '0px' }} />}
                    aria-controls='panel-content'
                    id='panel-header'
                    classes={{ content: classes.content }}
                    style={{ justifyContent: 'center' }} // Center the content
                    sx={{ justifyContent: 'center' }}
                >
                    <Stack direction='row' spacing={2}>
                        <Typography variant='body1'> list of routes </Typography>
                        {status && (
                            <Tooltip title={connectionStatus(status.ptRoute)} placement='right' sx={{ mr: 0.5 }}>
                                <PTRouteStatusIcon fontSize='small' color={ptRouteStatusColor} />
                            </Tooltip>
                        )}
                    </Stack>
                </AccordionSummary>
                <AccordionDetails
                    style={{
                        maxHeight: '50vh', // Set the maximum height to 50% of the viewport height
                        width: '50vh',
                        overflowY: 'auto',
                        whiteSpace: 'nowrap',
                        zoom: 0.95,
                    }}
                >
                    {/*<Virtuoso*/}
                    {/*    ref={virtuoso}*/}
                    {/*    totalCount={ptRoutes.length}*/}
                    {/*    itemContent={(index) => (*/}
                    {/*        <RouteListItem route={ptRoutes[index]} key={ptRoutes[index].shape_id}></RouteListItem>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*<Virtuoso*/}
                    {/*    ref={virtuoso}*/}
                    {/*    style={{ height: "400px", }}*/}
                    {/*    totalCount={200}*/}
                    {/*    itemContent={(index) => <div>Item {index}</div>}*/}
                    {/*/>*/}

                    <List>
                        {ptRoutes.map((ptRoute) => {
                            return <RouteListItem route={ptRoute} key={'' + ptRoute.shape_id}></RouteListItem>;
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export { RouteList };

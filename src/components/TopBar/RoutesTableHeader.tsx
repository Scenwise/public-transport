import * as React from 'react';

import { SvgIconComponent } from '@mui/icons-material';
import PendingIcon from '@mui/icons-material/Pending';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SyncIcon from '@mui/icons-material/Sync';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import { Stack, SvgIconTypeMap, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';

import { ReadyState } from '../../data/data';
import { selectPTRoutesFeatureList } from '../../dataStoring/slice';
import { filterRoutesByVisibleIds } from '../../hooks/filterHook/useVisibleRoutesUpdate';
import { useAppSelector } from '../../store';

const statusIcons: { [key in ReadyState]: [SvgIconComponent, SvgIconTypeMap['props']['color']] } = {
    [ReadyState.UNINSTANTIATED]: [RemoveCircleIcon, 'action'],
    [ReadyState.CONNECTING]: [PendingIcon, 'secondary'],
    [ReadyState.OPEN]: [SyncIcon, 'inherit'],
    [ReadyState.CLOSING]: [SyncDisabledIcon, 'secondary'],
    [ReadyState.CLOSED]: [SyncDisabledIcon, 'warning'],
};
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

const RoutesTableHeader: React.FC = () => {
    const status = useAppSelector((state) => state.slice.status);
    // Display the total number of routes and the number of visible routes
    const totalRoutesNr = useAppSelector(selectPTRoutesFeatureList).length;
    const filteredRoutes = useAppSelector((state) => state.slice.filteredRoutes).map((feature) => feature.properties);
    const visibleRoutes = useAppSelector((state) => state.slice.visibleRoutes);
    const filteredVisibleRoutesNr = filterRoutesByVisibleIds(
        visibleRoutes.isOn,
        visibleRoutes.ids,
        filteredRoutes,
    ).length;

    const getStatusIcon = (readystate: ReadyState): [SvgIconComponent, SvgIconTypeMap['props']['color']] => {
        return statusIcons[readystate];
    };
    const [PTRouteStatusIcon, ptRouteStatusColor] = getStatusIcon(status.ptRoute);

    return (
        <Stack direction='row' spacing={5} alignItems='center'>
            <Tooltip title={connectionStatus(status.ptRoute)} placement='right' sx={{ marginRight: 0.5 }}>
                <PTRouteStatusIcon fontSize='small' color={ptRouteStatusColor} />
            </Tooltip>
            <Stack direction='column' alignItems='center'>
                <Typography noWrap={true}>List of routes</Typography>
                <Typography variant='caption'>
                    {filteredVisibleRoutesNr} / {totalRoutesNr}
                </Typography>
            </Stack>
        </Stack>
    );
};

export { RoutesTableHeader };

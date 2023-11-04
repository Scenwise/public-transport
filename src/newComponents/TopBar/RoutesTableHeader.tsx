import * as React from 'react';

import { SvgIconComponent } from '@mui/icons-material';
import PendingIcon from '@mui/icons-material/Pending';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SyncIcon from '@mui/icons-material/Sync';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import { Stack, SvgIconTypeMap, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';

import { ReadyState } from '../../data/data';
import { useAppSelector } from '../../store';
import { FilterList } from '../Filter/FilterList';

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

    const getStatusIcon = (readystate: ReadyState): [SvgIconComponent, SvgIconTypeMap['props']['color']] => {
        return statusIcons[readystate];
    };
    const [PTRouteStatusIcon, ptRouteStatusColor] = getStatusIcon(status.ptRoute);

    return (
        <Stack direction='row' spacing={10} alignItems='center' sx={{ flexGrow: 1 }}>
            <Tooltip title={connectionStatus(status.ptRoute)} placement='right' sx={{ marginRight: 0.5 }}>
                <PTRouteStatusIcon fontSize='small' color={ptRouteStatusColor} />
            </Tooltip>
            <Typography noWrap={true}>list of routes</Typography>
            <FilterList />
        </Stack>
    );
};

export { RoutesTableHeader };

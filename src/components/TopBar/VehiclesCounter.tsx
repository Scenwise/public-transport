import React from 'react';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { useVehicleMarkers } from '../Vehicles/VehicleMapContext';

const VehicleCounter: React.FC = () => {
    const context = useVehicleMarkers();

    return (
        <Stack direction='column' alignItems='center'>
        <Typography noWrap={true}>Total vehicles</Typography>
        <Typography variant='caption'>{context.vehicleMarkers.size}</Typography>
    </Stack>
    );
};

export default VehicleCounter;
import React from 'react';

import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import FilterVehicleCheckbox from '../Vehicles/FilterVehicleCheckbox';
import Clock from './Clock';
import { CsvExport } from './CsvExport';
import { LocationSearchBar } from './LocationSearchBar';
import MapStyleSelector from './MapStyleSelector';
import { OffsetSlider } from './OffsetSlider';
import { RoutesTableHeader } from './RoutesTableHeader';

const TopBar: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <Stack direction='row' alignItems='center' sx={{ flexGrow: 1 }}>
                        <RoutesTableHeader />
                        <Stack
                            direction='row'
                            spacing={5}
                            alignItems='center'
                            justifyContent={'center'}
                            sx={{ flexGrow: 1 }}
                        >
                            <LocationSearchBar />
                            <OffsetSlider />
                            <MapStyleSelector />
                            <CsvExport />
                        </Stack>
                        <Stack
                            direction='row'
                            spacing={5}
                            alignItems='center'
                            justifyContent={'flex-end'}
                            sx={{ flexGrow: 1 }}
                        >
                            <FilterVehicleCheckbox />
                            <Clock />
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default TopBar;

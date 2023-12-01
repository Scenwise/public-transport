import React from 'react';

import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import FilterVehicleCheckbox from '../Vehicles/FilterVehicleCheckbox';
import { CsvExport } from './CsvExport';
import { LocationSearchBar } from './LocationSearchBar';
import MapStyleSelector from './MapStyleSelector';
import { OffsetSlider } from './OffsetSlider';
import { RoutesTableHeader } from './RoutesTableHeader';

const TopBar: React.FC = () => {
    return (
        <AppBar position='static'>
            <Toolbar>
                <Stack direction='row' spacing={20} alignItems='center' sx={{ flexGrow: 1 }}>
                    <RoutesTableHeader />
                    <Stack direction='row' spacing={10} alignItems='center' sx={{ flexGrow: 1 }}>
                        <LocationSearchBar />
                        <OffsetSlider />
                        <MapStyleSelector />
                        <CsvExport />
                        <FilterVehicleCheckbox />
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;

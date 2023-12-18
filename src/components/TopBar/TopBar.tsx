import React from 'react';

import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import FilterVehicleCheckbox from '../Vehicles/FilterVehicleCheckbox';
import Clock from './Clock';
import { CsvExport } from './CsvExport';
import { LocationSearchBar } from './LocationSearchBar';
import { MapSetting } from './MapSetting/MapSetting';
import { RoutesTableHeader } from './RoutesTableHeader';
import { TopBarComponentGroup } from './TopBarComponentGroup';

const TopBar: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <Stack direction='row' alignItems='center' sx={{ flexGrow: 1 }}>
                        <TopBarComponentGroup justifyContent={'flex-start'}>
                            <RoutesTableHeader />
                            <LocationSearchBar />
                        </TopBarComponentGroup>

                        <TopBarComponentGroup justifyContent={'center'}>
                            <FilterVehicleCheckbox />
                        </TopBarComponentGroup>

                        <TopBarComponentGroup justifyContent={'flex-end'}>
                            <MapSetting />
                            <CsvExport />
                            <Clock />
                        </TopBarComponentGroup>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default TopBar;

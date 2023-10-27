import React from 'react';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import { LocationSearchBar } from './LocationSearchBar';
import MapStyleSelector from './MapStyleSelector';
import { OffsetSlider } from './OffsetSlider';

const TopBar: React.FC = () => {
    return (
        <AppBar position='static'>
            <Toolbar>
                <Stack direction='row' spacing={45} alignItems='center' sx={{ flexGrow: 1 }}>
                    <IconButton color='inherit'>
                        <FilterListIcon />
                    </IconButton>
                    <Stack direction='row' spacing={10} alignItems='center' sx={{ flexGrow: 1 }}>
                        <LocationSearchBar />
                        <OffsetSlider />
                        <MapStyleSelector />
                        <IconButton color='inherit'>
                            <CloudDownloadIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;

import React from 'react';

import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

const LocationSearchBar: React.FC = () => {
    return (
        <>
            <Stack alignItems='center' direction='row'>
                <Stack alignItems='center'>
                    <input type='text' placeholder='Departure' />
                    <input type='text' placeholder='Destination' />
                </Stack>
                <Toolbar>
                    <IconButton color='inherit'>
                        <SearchIcon />
                    </IconButton>
                </Toolbar>
            </Stack>
        </>
    );
};
export { LocationSearchBar };

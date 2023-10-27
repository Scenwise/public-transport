import React, { useState } from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const MapStyleSelector: React.FC = () => {
    const [selectedStyle, setSelectedStyle] = useState('streets-v11');

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedStyle(event.target.value as string);
    };

    const mapStyles = [
        { value: 'streets-v11', label: 'Streets' },
        { value: 'outdoors-v11', label: 'Outdoors' },
        { value: 'light-v10', label: 'Light' },
        { value: 'dark-v10', label: 'Dark' },
        { value: 'satellite-v9', label: 'Satellite' },
    ];

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ color: 'white' }}>
                <InputLabel id='map-style-label' sx={{ color: 'white' }}>
                    Map style
                </InputLabel>
                <Select
                    labelId='map-style-label'
                    id='map-style-select'
                    value={selectedStyle}
                    onChange={handleChange}
                    sx={{ color: 'white' }} // Set the color using CSS
                >
                    {mapStyles.map((style) => (
                        <MenuItem key={style.value} value={style.value}>
                            {style.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default MapStyleSelector;

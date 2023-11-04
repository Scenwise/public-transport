import React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { updateMapStyle } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';

const MapStyleSelector: React.FC = () => {
    const dispatch = useAppDispatch();
    const mapStyleID = useAppSelector((state) => state.slice.mapStyle);

    const map = useAppSelector((state) => state.slice.map);

    const handleChange = (event: SelectChangeEvent) => {
        const id = Object.keys(mapStyles).find((key) => mapStyles[key] === event.target.value) as string;

        if (map) {
            switch (id) {
                case 'streets-v12':
                    map.setStyle('mapbox://styles/mapbox/streets-v12');
                    break;
                case 'outdoors-v12':
                    map.setStyle('mapbox://styles/mapbox/outdoors-v12');
                    break;
                case 'light-v11':
                    map.setStyle('mapbox://styles/mapbox/light-v11');
                    break;
                case 'dark-v11':
                    map.setStyle('mapbox://styles/mapbox/dark-v11');
                    break;
                case 'satellite-streets-v12':
                    map.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
                    break;
            }
        }

        dispatch(updateMapStyle(id));
    };

    interface MapStyle {
        [key: string]: string;
    }
    const mapStyles: MapStyle = {
        'streets-v12': 'Streets',
        'outdoors-v12': 'Outdoors',
        'light-v11': 'Light',
        'dark-v11': 'Dark',
        'satellite-streets-v12': 'Satellite',
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ color: 'white' }}>
                <InputLabel id='map-style-label' sx={{ color: 'white' }}>
                    Map style
                </InputLabel>
                <Select
                    labelId='map-style-label'
                    id='map-style-select'
                    value={mapStyles[mapStyleID]}
                    sx={{ color: 'white' }}
                    onChange={handleChange}
                >
                    {Object.entries(mapStyles).map(([id, label]) => (
                        <MenuItem id={id} key={id} value={label}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default MapStyleSelector;

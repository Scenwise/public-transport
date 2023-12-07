import React from 'react';

import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { IconButton, Menu, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { vehicleTypes } from '../../data/data';
import { useVehicleMarkers } from './VehicleMapContext';

const FilterVehicleCheckbox: React.FC = () => {
    const context = useVehicleMarkers();
    const vehicleMarkers = context.vehicleMarkers;
    const vehicleFilters = context.vehicleFilters;

    // For open and close of the filter menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const isDisabled = vehicleMarkers ? vehicleMarkers.size == 0 : false;

    const handleCheckboxChange = (key: string) => {
        const updatedTypes = vehicleFilters;
        const updatedValue = updatedTypes.get(key);
        if (updatedValue) {
            updatedValue.checked = !updatedValue.checked;
            updatedTypes.set(key, updatedValue);
            context.setVehicleFilters(new Map(updatedTypes));
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Stack direction='column' alignItems='center'>
                <Typography noWrap={true}>Total vehicles</Typography>
                <Typography variant='caption'>{context.vehicleMarkers.size}</Typography>
            </Stack>
            <Tooltip title={'Vehicles Filter'} placement={'right'}>
                <span>
                    <IconButton
                        color='inherit'
                        aria-label='Vehicles Filter'
                        onClick={handleMenuOpen}
                        disabled={isDisabled}
                        style={{ borderRadius: '50%' }}
                    >
                        <DirectionsBusIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{ padding: '10px' }}>
                    <Typography noWrap={true} fontWeight={'bolder'}>
                        {' '}
                        Displayed vehicle types{' '}
                    </Typography>
                    <FormGroup>
                        {Array.from(vehicleTypes).map(([key, value]) => (
                            <FormControlLabel
                                key={key}
                                control={
                                    <Checkbox
                                        checked={vehicleFilters.get(key)?.checked}
                                        onChange={() => handleCheckboxChange(key)}
                                        style={{ color: value.color }}
                                    />
                                }
                                label={<Typography fontSize={'15px'}> {key} </Typography>}
                            />
                        ))}
                    </FormGroup>
                </div>
            </Menu>
        </>
    );
};

export default FilterVehicleCheckbox;

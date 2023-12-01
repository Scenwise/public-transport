import React, { useState } from 'react';

import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { IconButton, Menu, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { vehicleTypesMap } from '../../data/data';
import { updateFilteredVehicleTypes } from '../../dataStoring/slice';
import { useAppDispatch } from '../../store';
import { useVehicleMarkers } from './VehicleMapContext';

type VehicleType = {
    name: string;
    color: string;
    checked: boolean;
};

const FilterVehicleCheckbox: React.FC = () => {
    const context = useVehicleMarkers();
    const vehicleMarkers = context.vehicleMarkers;
    const dispatch = useAppDispatch();

    // For open and close of the filter menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const isDisabled = vehicleMarkers ? vehicleMarkers.size == 0 : false;

    const vehicleTypes = Object.entries(vehicleTypesMap).map(([name, info]) => ({
        name,
        color: info.color,
        checked: info.checked,
    }));

    const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<VehicleType[]>(vehicleTypes);

    const handleCheckboxChange = (index: number) => {
        // Deep copy the array
        const updatedTypes = JSON.parse(JSON.stringify(selectedVehicleTypes));
        updatedTypes[index].checked = !updatedTypes[index].checked;
        setSelectedVehicleTypes(updatedTypes);
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
                        {vehicleTypes.map((type, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={selectedVehicleTypes[index].checked}
                                        onChange={() => handleCheckboxChange(index)}
                                        style={{ color: type.color }}
                                    />
                                }
                                label={<Typography fontSize={'15px'}> {type.name} </Typography>}
                            />
                        ))}
                    </FormGroup>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant='contained'
                            onClick={() => dispatch(updateFilteredVehicleTypes(selectedVehicleTypes))}
                            disableElevation
                            size='small'
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </Menu>
        </>
    );
};

export default FilterVehicleCheckbox;

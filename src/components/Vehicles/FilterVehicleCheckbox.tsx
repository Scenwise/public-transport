import React from 'react';

import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { vehicleTypes } from '../../data/data';
import { GeneralExpandableMenu } from '../GeneralExpandableMenu';
import { useVehicleMarkers } from './VehicleMapContext';

const FilterVehicleCheckbox: React.FC = () => {
    const context = useVehicleMarkers();
    const vehicleMarkers = context.vehicleMarkers;
    const vehicleFilters = context.vehicleFilters;

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

    return (
        <>
            <Stack direction='column' alignItems='center'>
                <Typography noWrap={true}>Total vehicles</Typography>
                <Typography variant='caption'>{context.vehicleMarkers.size}</Typography>
            </Stack>
            <GeneralExpandableMenu
                beforeExpanded={<DirectionsBusIcon />}
                menuTitle={'Vehicles Filter'}
                disabled={isDisabled}
            >
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
            </GeneralExpandableMenu>
        </>
    );
};

export default FilterVehicleCheckbox;

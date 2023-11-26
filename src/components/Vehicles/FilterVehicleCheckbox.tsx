import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
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

    if (vehicleMarkers.size == 0) return null;

    return (
        <Card sx={{ position: 'absolute', right: 0 }}>
            <CardContent>
                <Typography noWrap={true} fontWeight={'bolder'}>
                    {' '}
                    Displayed vehicle types{' '}
                </Typography>
                <FormGroup>
                    {vehicleTypes.map((type, index) => (
                        <FormControlLabel
                            key={index}
                            control={<Checkbox defaultChecked={true} onChange={() => handleCheckboxChange(index)} style={{color: type.color}}/>}
                            label={<Typography fontSize={'15px'}> {type.name} </Typography>}
                        />
                    ))}
                </FormGroup>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant='contained'
                    onClick={() => dispatch(updateFilteredVehicleTypes(selectedVehicleTypes))}
                    disableElevation
                    size='small'
                >
                    Apply
                </Button>
            </CardActions>
        </Card>
    );
};

export default FilterVehicleCheckbox;

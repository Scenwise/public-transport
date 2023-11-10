import React from 'react';

import { FormControlLabel, Switch, Typography } from '@mui/material';

import { updateVisibleRouteState } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';

const FilterVisibleSwitch: React.FC = () => {
    const dispatch = useAppDispatch();
    const visibleRoutes = useAppSelector((state) => state.slice.visibleRoutes);

    const handleSwitchChange = () => {
        dispatch(
            updateVisibleRouteState({
                ...visibleRoutes,
                isOn: !visibleRoutes.isOn,
            }),
        );
    };

    return (
        <FormControlLabel
            sx={{ ml: 0, mr: 1 }}
            control={<Switch onChange={handleSwitchChange} checked={visibleRoutes.isOn} color='primary' size='small' />}
            label={<Typography variant='caption'>Only show alerts on screen</Typography>}
            disableTypography
        />
    );
};

export default FilterVisibleSwitch;

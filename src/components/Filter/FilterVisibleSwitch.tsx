import React from 'react';

import HelpIcon from '@mui/icons-material/Help';
import { FormControlLabel, Switch, Tooltip, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

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
            label={
                <Stack direction={'row'} spacing={1}>
                    <Typography variant='caption'>Only show routes on screen</Typography>
                    <Tooltip
                        title={
                            'Option to only show routes in the left list that are actually on the current map screen view.'
                        }
                        placement={'right'}
                    >
                        <HelpIcon fontSize={'small'} color={'primary'} />
                    </Tooltip>
                </Stack>
            }
            disableTypography
        />
    );
};

export default FilterVisibleSwitch;

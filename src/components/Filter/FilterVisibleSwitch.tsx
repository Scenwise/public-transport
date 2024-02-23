import React from 'react';

import HelpIcon from '@mui/icons-material/Help';
import { FormControlLabel, Switch, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from '@mui/material';
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

    const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 200,
        },
    });

    return (
        <FormControlLabel
            sx={{ ml: 0, mr: 1 }}
            control={<Switch onChange={handleSwitchChange} checked={visibleRoutes.isOn} color='primary' size='small' />}
            label={
                <Stack direction={'row'} spacing={1}>
                    <Typography variant='caption'>Only list routes currently on screen</Typography>
                    <CustomWidthTooltip
                        title={
                            'Option to display only the routes in the left table that correspond to the current view on the map screen.'
                        }
                        placement={'right'}
                        arrow
                    >
                        <HelpIcon fontSize={'small'} color={'primary'} />
                    </CustomWidthTooltip>
                </Stack>
            }
            disableTypography
        />
    );
};

export default FilterVisibleSwitch;

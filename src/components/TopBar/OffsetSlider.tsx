import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { updateRouteOffset } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';

const Input = styled(MuiInput)`
    width: 42px;
`;

const OffsetSlider: React.FC = () => {
    const dispatch = useAppDispatch();
    const routeOffset = useAppSelector((state) => state.slice.routeOffset);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        dispatch(updateRouteOffset(newValue as number));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateRouteOffset(event.target.value === '' ? 0 : Number(event.target.value)));
    };

    const handleBlur = () => {
        if (routeOffset < 0) {
            updateRouteOffset(0);
        } else if (routeOffset > 10) {
            updateRouteOffset(10);
        }
    };

    return (
        <Box width={'10vw'}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography id='input-slider' gutterBottom textAlign='left' margin={0}>
                        Line offset
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Slider
                        color='secondary'
                        value={routeOffset}
                        onChange={handleSliderChange}
                        aria-labelledby='input-slider'
                        max={10}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Input
                        value={routeOffset}
                        size='small'
                        disableUnderline
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        sx={{ color: 'white' }}
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 10,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export { OffsetSlider };

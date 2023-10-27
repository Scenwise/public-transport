import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Input = styled(MuiInput)`
    width: 42px;
`;

const OffsetSlider: React.FC = () => {
    const [value, setValue] = React.useState(30);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 10) {
            setValue(10);
        }
    };

    return (
        <Box sx={{ width: 250 }}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography id='input-slider' gutterBottom textAlign='left' margin={0}>
                        Line offset
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Slider
                        color='secondary'
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby='input-slider'
                        max={10}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Input
                        value={value}
                        size='small'
                        onChange={handleInputChange}
                        onBlur={handleBlur}
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

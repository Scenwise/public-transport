import React from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { allLayers } from '../../../data/data';
import { updateClickableLayers } from '../../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../../store';

const LayersClickabilityToggle: React.FC = () => {
    const dispatch = useAppDispatch();
    const clickableLayers = useAppSelector((state) => state.slice.clickableLayers);
    const handleLayerToggle = (_e: React.MouseEvent<HTMLElement>, layers: string[]) =>
        dispatch(updateClickableLayers(layers));

    return (
        <Stack spacing={0.5}>
            <Typography variant='overline' display='block'>
                Clickable layers
            </Typography>

            <ToggleButtonGroup
                value={clickableLayers}
                onChange={handleLayerToggle}
                color={'primary'}
                aria-label='Layers clickability toggle'
                fullWidth
            >
                {allLayers.map((layer: string) => {
                    return (
                        <ToggleButton value={layer} key={layer} aria-label={layer}>
                            {layer}
                        </ToggleButton>
                    );
                })}
            </ToggleButtonGroup>
        </Stack>
    );
};

export { LayersClickabilityToggle };

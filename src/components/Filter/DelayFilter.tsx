import React from 'react';

import { Typography } from '@mui/material';
import Slider from '@mui/material/Slider';

import { FilterType } from '../../data/data';
import { updateFilter } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';

function valueLabelFormat(value: number) {
    if (value < 0) return 'All';
    return `≥ ${value} min`;
}

const marks = [{ value: -1 }, { value: 0 }, { value: 5 }, { value: 10 }, { value: 15 }, { value: 30 }, { value: 60 }];

const DelayFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.slice.filters);
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        dispatch(
            updateFilter({
                optionTitle: 'Delay',
                optionKey: 'delay',
                type: FilterType.range,
                options: [],
                availableOptions: [],
                variants: [],
                value: newValue as number,
            }),
        );
    };

    return (
        <div>
            <Typography noWrap={true} color='#666666'>
                Delay
            </Typography>
            <div style={{ display: 'flex', paddingLeft: '30px', paddingRight: '30px' }}>
                <div style={{ marginLeft: 'auto', marginRight: 'auto', flexGrow: '1' }}>
                    <Slider
                        value={filters['delay'].value}
                        color='error'
                        valueLabelFormat={valueLabelFormat}
                        valueLabelDisplay='auto'
                        step={null}
                        min={-1}
                        max={60}
                        marks={marks}
                        onChange={handleSliderChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DelayFilter;
